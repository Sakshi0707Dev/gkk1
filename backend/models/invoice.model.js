import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'pcs' },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },
  items: {
    type: [invoiceItemSchema],
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  cgst: {
    type: Number,
    default: 0,
  },
  sgst: {
    type: Number,
    default: 0,
  },
  igst: {
    type: Number,
    default: 0,
  },
  totalGst: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  invoiceDate: {
    type: Date,
    default: Date.now,
  },
  invoicePath: {
    type: String,
    default: null,
  },
  invoiceUrl: {
    type: String,
    default: null,
  },
  whatsappSent: {
    type: Boolean,
    default: false,
  },
  whatsappSentAt: {
    type: Date,
    default: null,
  },
  whatsappMessageId: {
    type: String,
    default: null,
  },
  whatsappError: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['generated', 'sent', 'failed'],
    default: 'generated',
  },
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;