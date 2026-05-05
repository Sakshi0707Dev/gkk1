import crypto from 'crypto';
import Razorpay from 'razorpay';

import { ENV } from '../config/env.js';
import Order from '../models/order.model.js';
import { AppError } from '../utils/asyncHandler.js';

const getRazorpayClient = () => {
  if (!ENV.RAZORPAY_KEY_ID || !ENV.RAZORPAY_KEY_SECRET) {
    throw new AppError('Razorpay is not configured on this server.', 500);
  }

  return new Razorpay({
    key_id: ENV.RAZORPAY_KEY_ID,
    key_secret: ENV.RAZORPAY_KEY_SECRET,
  });
};

export const createRazorpayOrderService = async ({ orderId, user }) => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found.', 404);

  const isOwner = String(order.userId) === String(user._id);
  const isAdmin = user.role === 'admin';
  if (!isOwner && !isAdmin) {
    throw new AppError('You do not have permission to pay for this order.', 403);
  }

  const amount = order.amountInPaise || Math.round(Number(order.totalAmount || 0) * 100);
  if (!amount || amount < 0) {
    throw new AppError('Invalid order amount.', 400);
  }

  const razorpay = getRazorpayClient();
  const razorpayOrder = await razorpay.orders.create({
    amount,
    currency: order.currency || 'INR',
    receipt: order.orderId,
    notes: { internalOrderId: String(order._id) },
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  return {
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    keyId: ENV.RAZORPAY_KEY_ID,
  };
};

export const verifyPaymentService = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
  if (!order) throw new AppError('Order not found for this Razorpay order.', 404);

  const expectedSignature = crypto
    .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const isSignatureValid =
    expectedSignature.length === razorpay_signature.length &&
    crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf8'),
      Buffer.from(razorpay_signature, 'utf8')
    );

  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;

  if (isSignatureValid) {
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.statusHistory.push({ status: 'confirmed' });
  } else {
    order.paymentStatus = 'failed';
  }

  await order.save();

  return {
    success: isSignatureValid,
    order,
  };
};
