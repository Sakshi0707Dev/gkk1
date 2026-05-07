import express from 'express';
import {
  createInvoice,
  generateInvoicePDF,
  sendInvoiceWhatsApp,
  getInvoiceById,
  getInvoiceByOrderId,
  getUserInvoices,
  getAllInvoices,
  regenerateInvoicePDF,
} from '../controllers/invoice.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/generate', protect, createInvoice);
router.post('/generate-pdf', protect, generateInvoicePDF);
router.post('/send-whatsapp/:invoiceId', protect, sendInvoiceWhatsApp);

router.get('/my-invoices', protect, getUserInvoices);
router.get('/order/:orderId', protect, getInvoiceByOrderId);
router.get('/:invoiceId', protect, getInvoiceById);

router.get('/', protect, restrictTo('admin'), getAllInvoices);
router.post('/regenerate-pdf/:invoiceId', protect, restrictTo('admin'), regenerateInvoicePDF);

export default router;