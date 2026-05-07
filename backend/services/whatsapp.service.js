import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WhatsAppService {
  constructor() {
    this.baseUrl = ENV.BOTBIZ_API_URL || 'https://api.botbiz.in';
    this.apiKey = ENV.BOTBIZ_API_KEY;
    this.deviceId = ENV.BOTBIZ_DEVICE_ID;
    this.shopName = ENV.SHOP_NAME || 'Gawande Krushi Kendra';
  }

  formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `91${cleaned}@c.us`;
    }
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `${cleaned}@c.us`;
    }
    if (phone.includes('@c.us')) {
      return phone;
    }
    return `91${cleaned}@c.us`;
  }

  buildInvoiceMessage(customerName, amount) {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

    return `Hi ${customerName},
Details of your Sale Invoice from ${this.shopName}.
Invoice Amount: ₹${formattedAmount}
Thank you for doing business with us.`;
  }

  async sendTextMessage(phone, message) {
    if (!this.apiKey || !this.deviceId) {
      console.warn('[WHATSAPP_SERVICE] Botbiz credentials not configured');
      return {
        success: false,
        error: 'WhatsApp service not configured',
      };
    }

    const formattedPhone = this.formatPhoneNumber(phone);

    try {
      const response = await axios.post(
        `${this.baseUrl}/messages/send`,
        {
          messagingProduct: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      console.log(`[WHATSAPP_SERVICE] Text message sent to ${phone}`);

      return {
        success: true,
        messageId: response.data?.messages?.[0]?.id || response.data?.id,
        response: response.data,
      };
    } catch (error) {
      console.error(`[WHATSAPP_SERVICE] Error sending text message:`, error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || error.message,
        statusCode: error.response?.status,
      };
    }
  }

  async sendInvoiceWithAttachment(phone, customerName, amount, pdfPath) {
    if (!this.apiKey || !this.deviceId) {
      console.warn('[WHATSAPP_SERVICE] Botbiz credentials not configured');
      return {
        success: false,
        error: 'WhatsApp service not configured',
      };
    }

    const formattedPhone = this.formatPhoneNumber(phone);
    const message = this.buildInvoiceMessage(customerName, amount);

    try {
      let pdfBase64 = null;

      if (pdfPath) {
        const absolutePath = path.isAbsolute(pdfPath)
          ? pdfPath
          : path.join(__dirname, '../../', pdfPath);

        const fileBuffer = await fs.readFile(absolutePath);
        pdfBase64 = fileBuffer.toString('base64');
      }

      const payload = {
        messagingProduct: 'whatsapp',
        to: formattedPhone,
        type: 'document',
        document: {
          link: null,
          caption: message,
          filename: `Invoice_${customerName.replace(/\s+/g, '_')}.pdf`,
        },
      };

      if (pdfBase64) {
        payload.document.document = pdfBase64;
      }

      const response = await axios.post(
        `${this.baseUrl}/messages/send`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      console.log(`[WHATSAPP_SERVICE] Invoice sent to ${phone}`);

      return {
        success: true,
        messageId: response.data?.messages?.[0]?.id || response.data?.id,
        response: response.data,
      };
    } catch (error) {
      console.error(`[WHATSAPP_SERVICE] Error sending invoice:`, error.response?.data || error.message);

      const fallbackResult = await this.sendTextMessage(phone, message);

      return {
        success: false,
        error: error.response?.data?.message || error.message,
        statusCode: error.response?.status,
        fallbackSent: fallbackResult.success,
        fallbackMessageId: fallbackResult.messageId,
      };
    }
  }

  async sendInvoiceMessageSequence(phone, customerName, amount, pdfPath) {
    const message = this.buildInvoiceMessage(customerName, amount);

    const textResult = await this.sendTextMessage(phone, message);

    if (!textResult.success) {
      console.warn(`[WHATSAPP_SERVICE] Failed to send text message, trying with attachment`);
    }

    if (pdfPath) {
      const attachmentResult = await this.sendInvoiceWithAttachment(
        phone,
        customerName,
        amount,
        pdfPath
      );

      return {
        textSent: textResult.success,
        textMessageId: textResult.messageId,
        attachmentSent: attachmentResult.success,
        attachmentMessageId: attachmentResult.messageId,
        error: !attachmentResult.success ? attachmentResult.error : null,
      };
    }

    return {
      textSent: textResult.success,
      textMessageId: textResult.messageId,
      attachmentSent: false,
    };
  }

  async checkDeviceStatus() {
    if (!this.apiKey || !this.deviceId) {
      return { connected: false, error: 'Service not configured' };
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/device/${this.deviceId}/status`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 10000,
        }
      );

      return {
        connected: true,
        status: response.data?.status,
        response: response.data,
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
      };
    }
  }
}

export const whatsappService = new WhatsAppService();
export default whatsappService;