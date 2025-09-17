// src/services/telegramService.js
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

// Simple Telegram message sender
export const sendTelegramMessage = async (formData) => {
  // Validate environment variables
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram configuration missing');
    throw new Error('Service configuration error');
  }

  const { name, email, phone, selectedService, message } = formData;
  
  // Format message for Telegram
  const telegramMessage = `
🚀 *NEW INQUIRY - REDIX DIGITAL*

👤 *Client Details:*
• Name: ${name}
• Email: ${email}
• Phone: ${phone}

🛠️ *Service:* ${selectedService}

💬 *Message:*
${message}

📅 *Time:* ${new Date().toLocaleString()}
⚡ *Source:* Website Chat
  `.trim();

  const requestBody = {
    chat_id: TELEGRAM_CHAT_ID,
    text: telegramMessage,
    parse_mode: 'Markdown'
  };

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Message sent successfully:', result);
    return true;
    
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    throw error;
  }
};

export default sendTelegramMessage;
