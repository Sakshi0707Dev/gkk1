import Order from '../models/order.model.js';
import { AppError } from '../utils/asyncHandler.js';

const validateShippingFields = (address) => {
  const required = ['name', 'phone', 'addressLine', 'city', 'state', 'pincode'];
  const missing = required.filter((f) => !address[f] || !String(address[f]).trim());
  if (missing.length > 0) {
    throw new AppError(
      `Missing required shipping fields: ${missing.join(', ')}`,
      400
    );
  }

  const phone = String(address.phone).replace(/\D/g, '');
  if (phone.length !== 10) {
    throw new AppError('Phone number must be exactly 10 digits.', 400);
  }

  const pincode = String(address.pincode).replace(/\D/g, '');
  if (pincode.length !== 6) {
    throw new AppError('Pincode must be exactly 6 digits.', 400);
  }
};

const calculateSubtotal = (items) =>
  items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

export const createOrderService = async ({ userId, items, address, paymentMethod }) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError('Order must contain at least one item.', 400);
  }
  if (!address || typeof address !== 'object') {
    throw new AppError('Shipping address is required.', 400);
  }

  validateShippingFields(address);

  if (!paymentMethod || !['COD', 'UPI'].includes(paymentMethod)) {
    throw new AppError('Payment method must be either COD or UPI.', 400);
  }

  const subtotal = calculateSubtotal(items);
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  const orderData = {
    orderId: `ORD${Date.now()}`,
    userId,
    items,
    totalAmount: total,
    amountInPaise: Math.round(total * 100),
    address: {
      name: String(address.name).trim(),
      phone: String(address.phone).trim(),
      addressLine: String(address.addressLine).trim(),
      addressLine2: address.addressLine2 ? String(address.addressLine2).trim() : '',
      city: String(address.city).trim(),
      state: address.state ? String(address.state).trim() : '',
      pincode: String(address.pincode).trim(),
      landmark: address.landmark ? String(address.landmark).trim() : '',
    },
    subtotal,
    shippingCost,
    total,
    paymentMethod,
    estimatedDelivery,
    statusHistory: [{ status: 'placed', changedAt: new Date() }],
  };

  const order = await Order.create(orderData);

  return order;
};

export const getUserOrdersService = async (userId) =>
  Order.find({ userId }).sort({ createdAt: -1 });

export const getAllOrdersService = async () =>
  Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });

export const getOrderByIdService = async ({ orderMongoId, user }) => {
  const order = await Order.findById(orderMongoId);
  if (!order) throw new AppError('Order not found.', 404);

  const isOwner = String(order.userId) === String(user._id);
  const isAdmin = user.role === 'admin';
  if (!isOwner && !isAdmin) {
    throw new AppError('You do not have permission to view this order.', 403);
  }

  return order;
};

const VALID_TRANSITIONS = {
  placed:          ['confirmed', 'cancelled'],
  confirmed:       ['packed', 'cancelled'],
  packed:          ['shipped', 'cancelled'],
  shipped:         ['outfordelivery'],
  outfordelivery:  ['delivered'],
  delivered:       [],
  cancelled:       [],
};

export const updateOrderStatusService = async ({ orderMongoId, status }) => {
  const order = await Order.findById(orderMongoId);
  if (!order) throw new AppError('Order not found.', 404);

  const allowed = VALID_TRANSITIONS[order.orderStatus];
  if (!allowed || !allowed.includes(status)) {
    throw new AppError(
      `Cannot transition order from '${order.orderStatus}' to '${status}'.`,
      400
    );
  }

  order.orderStatus = status;
  order.statusHistory.push({ status, changedAt: new Date() });
  await order.save({ validateModifiedOnly: true });

  return order;
};
