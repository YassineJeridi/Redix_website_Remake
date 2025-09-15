// src/services/telegramService.js
const TELEGRAM_API = `https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}/sendMessage`;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

class TelegramService {
  constructor() {
    this.apiUrl = TELEGRAM_API;
    this.chatId = CHAT_ID;
  }

  async sendMessage(message, options = {}) {
    try {
      const payload = {
        chat_id: this.chatId,
        text: message,
        parse_mode: options.parseMode || 'HTML',
        disable_web_page_preview: options.disablePreview || true,
        ...options
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.status}`);
      }

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('Telegram service error:', error);
      return false;
    }
  }

  async sendContactNotification(contactData) {
    const message = `
🔥 <b>NEW CONTACT FROM REDIX WEBSITE</b>

👤 <b>Name:</b> ${contactData.name}
📧 <b>Email:</b> ${contactData.email}
${contactData.phone ? `📞 <b>Phone:</b> ${contactData.phone}` : ''}
🛠️ <b>Service:</b> ${contactData.service}

💬 <b>Message:</b>
${contactData.message}

⏰ <b>Time:</b> ${new Date().toLocaleString('fr-TN', { 
  timeZone: 'Africa/Tunis',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
    `;

    return await this.sendMessage(message);
  }

  async sendQuoteRequest(quoteData) {
    const message = `
💰 <b>QUOTE REQUEST FROM WEBSITE</b>

👤 <b>Client:</b> ${quoteData.name}
📧 <b>Email:</b> ${quoteData.email}
🏢 <b>Company:</b> ${quoteData.company || 'Not specified'}
🛠️ <b>Service:</b> ${quoteData.service}
💰 <b>Budget:</b> ${quoteData.budget || 'Not specified'}

📝 <b>Project Details:</b>
${quoteData.projectDetails}

⏰ <b>Time:</b> ${new Date().toLocaleString('fr-TN', { 
  timeZone: 'Africa/Tunis',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
    `;

    return await this.sendMessage(message);
  }

  async sendNewsletterSubscription(email) {
    const message = `
📧 <b>NEW NEWSLETTER SUBSCRIPTION</b>

✉️ <b>Email:</b> ${email}
⏰ <b>Time:</b> ${new Date().toLocaleString('fr-TN', { 
  timeZone: 'Africa/Tunis',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
    `;

    return await this.sendMessage(message);
  }

  async sendErrorNotification(error, context = '') {
    const message = `
⚠️ <b>WEBSITE ERROR DETECTED</b>

🔍 <b>Context:</b> ${context}
❌ <b>Error:</b> ${error.message}
📍 <b>Stack:</b> ${error.stack?.substring(0, 500) || 'Not available'}

⏰ <b>Time:</b> ${new Date().toLocaleString('fr-TN', { 
  timeZone: 'Africa/Tunis',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
    `;

    return await this.sendMessage(message);
  }

  isConfigured() {
    return !!(this.apiUrl && this.chatId && this.chatId !== 'undefined');
  }
}

export const telegramService = new TelegramService();
export const sendTelegramMessage = (message) => telegramService.sendMessage(message);
export default telegramService;
