// src/services/telegramService.js

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// Rate limiting and retry configuration
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

let lastRequestTime = 0;
let requestQueue = [];

// Enhanced error types
export const TelegramError = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  INVALID_CHAT_ID: 'INVALID_CHAT_ID',
  MESSAGE_TOO_LONG: 'MESSAGE_TOO_LONG',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Sleep utility for retry delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced message formatting with better structure
export const formatTelegramMessage = (data) => {
  const {
    name,
    email,
    phone,
    service,
    message,
    budget,
    timeline
  } = data;

  const timestamp = new Date().toLocaleString('en-TN', {
    timeZone: 'Africa/Tunis',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  return `
🚀 *NEW SERVICE INQUIRY - REDIX DIGITAL*

👤 *Client Information:*
• Name: ${name}
• Email: ${email}
${phone ? `• Phone: ${phone}` : ''}

🛠️ *Service Details:*
• Service: ${service}
${budget ? `• Budget: ${budget}` : ''}
${timeline ? `• Timeline: ${timeline}` : ''}

💬 *Project Details:*
${message}

📊 *Inquiry Summary:*
• Source: Website Contact Form
• Priority: ${service === 'Digital Marketing' ? 'High' : 'Normal'}
• Status: New Inquiry

📅 *Submitted:* ${timestamp}

---
*Powered by Redix Digital Solutions*
`.trim();
};

// Rate limiting handler
const enforceRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const delay = RATE_LIMIT_DELAY - timeSinceLastRequest;
    await sleep(delay);
  }
  
  lastRequestTime = Date.now();
};

// Enhanced error handler with specific error types
const handleTelegramError = (error, response) => {
  console.error('Telegram API Error:', error);

  if (!navigator.onLine) {
    return {
      type: TelegramError.NETWORK_ERROR,
      message: 'No internet connection. Please check your network and try again.',
      retryable: true
    };
  }

  if (response) {
    const status = response.status;
    
    switch (status) {
      case 401:
        return {
          type: TelegramError.INVALID_TOKEN,
          message: 'Authentication failed. Please contact support.',
          retryable: false
        };
      case 400:
        return {
          type: TelegramError.INVALID_CHAT_ID,
          message: 'Invalid configuration. Please contact support.',
          retryable: false
        };
      case 413:
        return {
          type: TelegramError.MESSAGE_TOO_LONG,
          message: 'Message is too long. Please shorten your message and try again.',
          retryable: false
        };
      case 429:
        return {
          type: TelegramError.RATE_LIMITED,
          message: 'Too many requests. Please wait a moment and try again.',
          retryable: true
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: TelegramError.NETWORK_ERROR,
          message: 'Server temporarily unavailable. Please try again in a few moments.',
          retryable: true
        };
      default:
        return {
          type: TelegramError.UNKNOWN_ERROR,
          message: `Request failed with status ${status}. Please try again.`,
          retryable: true
        };
    }
  }

  return {
    type: TelegramError.NETWORK_ERROR,
    message: 'Network error occurred. Please check your connection and try again.',
    retryable: true
  };
};

// Core send function with retry logic
const sendTelegramMessageWithRetry = async (message, attempt = 1) => {
  try {
    // Enforce rate limiting
    await enforceRateLimit();

    // Validate environment variables
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram configuration');
      return {
        success: false,
        error: {
          type: TelegramError.INVALID_TOKEN,
          message: 'Service configuration error. Please contact support.',
          retryable: false
        }
      };
    }

    // Prepare request
    const requestBody = {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    };

    console.log(`Sending Telegram message (attempt ${attempt}/${MAX_RETRIES})...`);

    // Send request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Handle response
    if (response.ok) {
      const data = await response.json();
      console.log('Telegram message sent successfully:', data);
      return { success: true, data };
    } else {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Telegram API error (${response.status}):`, errorText);
      
      const error = handleTelegramError(new Error(`HTTP ${response.status}`), response);
      
      // Retry logic for retryable errors
      if (error.retryable && attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Retrying in ${delay}ms... (attempt ${attempt + 1}/${MAX_RETRIES})`);
        await sleep(delay);
        return sendTelegramMessageWithRetry(message, attempt + 1);
      }
      
      return { success: false, error };
    }

  } catch (error) {
    console.error(`Telegram request failed (attempt ${attempt}):`, error);
    
    const errorInfo = handleTelegramError(error);
    
    // Retry logic for retryable errors
    if (errorInfo.retryable && attempt < MAX_RETRIES) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
      console.log(`Retrying in ${delay}ms... (attempt ${attempt + 1}/${MAX_RETRIES})`);
      await sleep(delay);
      return sendTelegramMessageWithRetry(message, attempt + 1);
    }
    
    return { success: false, error: errorInfo };
  }
};

// Queue management for handling multiple requests
const processQueue = async () => {
  if (requestQueue.length === 0) return;
  
  const { message, resolve, reject } = requestQueue.shift();
  
  try {
    const result = await sendTelegramMessageWithRetry(message);
    if (result.success) {
      resolve(true);
    } else {
      console.error('Failed to send message after all retries:', result.error);
      reject(new Error(result.error.message));
    }
  } catch (error) {
    reject(error);
  }
  
  // Process next item in queue after delay
  if (requestQueue.length > 0) {
    setTimeout(processQueue, RATE_LIMIT_DELAY);
  }
};

// Main export function with enhanced features
export const sendTelegramMessage = async (messageData) => {
  return new Promise((resolve, reject) => {
    // Format message based on data type
    const message = typeof messageData === 'string' 
      ? messageData 
      : formatTelegramMessage(messageData);
    
    // Add to queue
    requestQueue.push({ message, resolve, reject });
    
    // Start processing if this is the first item
    if (requestQueue.length === 1) {
      processQueue();
    }
  });
};

// Utility function to test connection
export const testTelegramConnection = async () => {
  try {
    const testMessage = `🔧 *Connection Test - Redix Digital*\n\nTesting Telegram integration...\n\nTime: ${new Date().toLocaleString('en-TN', { timeZone: 'Africa/Tunis' })}`;
    
    const result = await sendTelegramMessage(testMessage);
    return { success: true, message: 'Connection test successful!' };
  } catch (error) {
    return { 
      success: false, 
      message: error.message || 'Connection test failed' 
    };
  }
};

// Health check function
export const checkTelegramHealth = () => {
  return {
    configured: !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID),
    online: navigator.onLine,
    queueLength: requestQueue.length,
    lastRequestTime: lastRequestTime ? new Date(lastRequestTime).toISOString() : null
  };
};

// Export configuration for debugging (development only)
export const getTelegramConfig = () => {
  if (import.meta.env.DEV) {
    return {
      botToken: TELEGRAM_BOT_TOKEN ? '***configured***' : 'missing',
      chatId: TELEGRAM_CHAT_ID ? '***configured***' : 'missing',
      apiUrl: TELEGRAM_API_URL
    };
  }
  return { message: 'Config only available in development mode' };
};

export default sendTelegramMessage;
