import Order from '../models/order.model.js';
import { AppError } from '../utils/asyncHandler.js';

export const createOrderService = async ({ userId, items, totalAmount, address }) => {
  const order = await Order.create({
    orderId: `ORD${Date.now()}`,
    userId,
    items,
    totalAmount,
    amountInPaise: Math.round(Number(totalAmount || 0) * 100),
    address,
    statusHistory: [{ status: 'placed' }],
  });

  return order;
};

export const getUserOrdersService = async (userId) =>
  Order.find({ userId }).sort({ createdAt: -1 });

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

export const updateOrderStatusService = async ({ orderMongoId, status }) => {
  const order = await Order.findById(orderMongoId);
  if (!order) throw new AppError('Order not found.', 404);

  order.orderStatus = status;
  order.statusHistory.push({ status });
  await order.save();

  return order;
};
