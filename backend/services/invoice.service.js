import Invoice from '../models/invoice.model.js';
import Order from '../models/order.model.js';
import { generateInvoiceHTML } from '../templates/invoice.template.js';
import { pdfService } from './pdf.service.js';
import { whatsappService } from './whatsapp.service.js';
import { ENV } from '../config/env.js';

class InvoiceService {
  generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  }

  calculateGST(subtotal, cgstRate = 0, sgstRate = 0, igstRate = 0) {
    const cgst = subtotal * (cgstRate / 100);
    const sgst = subtotal * (sgstRate / 100);
    const igst = subtotal * (igstRate / 100);
    const totalGst = cgst + sgst + igst;

    return {
      cgst: Math.round(cgst * 100) / 100,
      sgst: Math.round(sgst * 100) / 100,
      igst: Math.round(igst * 100) / 100,
      totalGst: Math.round(totalGst * 100) / 100,
    };
  }

  prepareInvoiceData(order) {
    const items = order.items.map(item => ({
      productName: item.name,
      quantity: item.quantity,
      unit: 'pcs',
      price: item.price,
      total: item.price * item.quantity,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const gstRates = ENV.INVOICE_GST_RATES || { cgst: 9, sgst: 9, igst: 18 };
    const gst = this.calculateGST(subtotal, gstRates.cgst, gstRates.sgst, gstRates.igst);

    const customerAddress = [
      order.address.addressLine,
      order.address.city,
      order.address.pincode,
    ].filter(Boolean).join(', ');

    return {
      invoiceNumber: this.generateInvoiceNumber(),
      invoiceDate: new Date(),
      orderId: order.orderId,
      customerName: order.address.name,
      customerPhone: order.address.phone,
      customerAddress,
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      cgst: gst.cgst,
      sgst: gst.sgst,
      igst: gst.igst,
      totalGst: gst.totalGst,
      cgstRate: gstRates.cgst,
      sgstRate: gstRates.sgst,
      igstRate: gstRates.igst,
      totalAmount: Math.round((subtotal + gst.totalGst) * 100) / 100,
      shopName: ENV.SHOP_NAME || 'Gawande Krushi Kendra',
      shopAddress: ENV.SHOP_ADDRESS || '',
      shopPhone: ENV.SHOP_PHONE || '',
      shopEmail: ENV.SHOP_EMAIL || '',
      shopGstin: ENV.SHOP_GSTIN || '',
    };
  }

  async generateInvoice(orderId) {
    try {
      console.log(`[INVOICE_SERVICE] Generating invoice for order: ${orderId}`);

      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      const existingInvoice = await Invoice.findOne({ orderId: order._id });
      if (existingInvoice) {
        console.log(`[INVOICE_SERVICE] Invoice already exists for order: ${orderId}`);
        return {
          success: false,
          error: 'Invoice already generated for this order',
          invoice: existingInvoice,
        };
      }

      const invoiceData = this.prepareInvoiceData(order);
      const invoiceHTML = generateInvoiceHTML(invoiceData);

      console.log(`[INVOICE_SERVICE] Generating PDF for invoice: ${invoiceData.invoiceNumber}`);
      const pdfResult = await pdfService.generateInvoicePDF(
        invoiceHTML,
        invoiceData.invoiceNumber
      );

      if (!pdfResult.success) {
        throw new Error('Failed to generate PDF');
      }

      const invoice = await Invoice.create({
        invoiceNumber: invoiceData.invoiceNumber,
        orderId: order._id,
        userId: order.userId,
        customerName: invoiceData.customerName,
        customerPhone: invoiceData.customerPhone,
        customerAddress: invoiceData.customerAddress,
        items: invoiceData.items,
        subtotal: invoiceData.subtotal,
        cgst: invoiceData.cgst,
        sgst: invoiceData.sgst,
        igst: invoiceData.igst,
        totalGst: invoiceData.totalGst,
        totalAmount: invoiceData.totalAmount,
        invoiceDate: invoiceData.invoiceDate,
        invoicePath: pdfResult.filePath,
        invoiceUrl: pdfResult.publicUrl,
        status: 'generated',
      });

      console.log(`[INVOICE_SERVICE] Invoice created: ${invoice.invoiceNumber}`);

      return {
        success: true,
        invoice,
        pdfPath: pdfResult.filePath,
        pdfUrl: pdfResult.publicUrl,
      };
    } catch (error) {
      console.error(`[INVOICE_SERVICE] Error generating invoice:`, error);
      throw error;
    }
  }

  async sendInvoiceWhatsApp(invoiceId) {
    try {
      console.log(`[INVOICE_SERVICE] Sending invoice via WhatsApp: ${invoiceId}`);

      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      if (invoice.whatsappSent) {
        console.log(`[INVOICE_SERVICE] WhatsApp already sent for invoice: ${invoiceId}`);
        return {
          success: false,
          error: 'WhatsApp message already sent',
        };
      }

      const whatsappResult = await whatsappService.sendInvoiceMessageSequence(
        invoice.customerPhone,
        invoice.customerName,
        invoice.totalAmount,
        invoice.invoicePath
      );

      invoice.whatsappSent = whatsappResult.textSent || whatsappResult.attachmentSent;
      invoice.whatsappSentAt = invoice.whatsappSent ? new Date() : null;
      invoice.whatsappMessageId = whatsappResult.textMessageId || whatsappResult.attachmentMessageId;
      invoice.whatsappError = whatsappResult.error;
      invoice.status = invoice.whatsappSent ? 'sent' : 'failed';

      await invoice.save();

      console.log(`[INVOICE_SERVICE] WhatsApp sent for invoice: ${invoice.invoiceNumber}`);

      return {
        success: invoice.whatsappSent,
        whatsappResult,
      };
    } catch (error) {
      console.error(`[INVOICE_SERVICE] Error sending WhatsApp:`, error);
      throw error;
    }
  }

  async generateAndSendInvoice(orderId) {
    try {
      console.log(`[INVOICE_SERVICE] Generating and sending invoice for order: ${orderId}`);

      const invoiceResult = await this.generateInvoice(orderId);

      if (!invoiceResult.success) {
        return invoiceResult;
      }

      const whatsappResult = await this.sendInvoiceWhatsApp(invoiceResult.invoice._id);

      return {
        success: true,
        invoice: invoiceResult.invoice,
        pdfPath: invoiceResult.pdfPath,
        pdfUrl: invoiceResult.pdfUrl,
        whatsappSent: whatsappResult.success,
        whatsappMessageId: whatsappResult.whatsappResult?.textMessageId || whatsappResult.whatsappResult?.attachmentMessageId,
      };
    } catch (error) {
      console.error(`[INVOICE_SERVICE] Error in generateAndSendInvoice:`, error);
      throw error;
    }
  }

  async getInvoiceById(invoiceId) {
    return Invoice.findById(invoiceId).populate('orderId');
  }

  async getInvoiceByOrderId(orderId) {
    return Invoice.findOne({ orderId });
  }

  async getUserInvoices(userId) {
    return Invoice.find({ userId }).sort({ createdAt: -1 });
  }

  async getAllInvoices(options = {}) {
    const { page = 1, limit = 20, status } = options;
    const query = status ? { status } : {};

    const invoices = await Invoice.find(query)
      .populate('orderId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Invoice.countDocuments(query);

    return {
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async regenerateInvoicePDF(invoiceId) {
    try {
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      const order = await Order.findById(invoice.orderId);
      if (!order) {
        throw new Error('Order not found for this invoice');
      }

      const invoiceData = this.prepareInvoiceData(order);
      invoiceData.invoiceNumber = invoice.invoiceNumber;

      const invoiceHTML = generateInvoiceHTML(invoiceData);
      const pdfResult = await pdfService.generateInvoicePDF(
        invoiceHTML,
        invoice.invoiceNumber
      );

      invoice.invoicePath = pdfResult.filePath;
      invoice.invoiceUrl = pdfResult.publicUrl;
      await invoice.save();

      return {
        success: true,
        pdfPath: pdfResult.filePath,
        pdfUrl: pdfResult.publicUrl,
      };
    } catch (error) {
      console.error(`[INVOICE_SERVICE] Error regenerating PDF:`, error);
      throw error;
    }
  }
}

export const invoiceService = new InvoiceService();
export default invoiceService;