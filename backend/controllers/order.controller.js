import { AppError, asyncHandler } from '../utils/asyncHandler.js';
import {
  createOrderService,
  getAllOrdersService,
  getOrderByIdService,
  getUserOrdersService,
  updateOrderStatusService,
} from '../services/order.service.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, address, paymentMethod } = req.body;

  if (!items || !address) {
    throw new AppError('items and address are required.', 400);
  }

  const order = await createOrderService({
    userId: req.user._id,
    items,
    address,
    paymentMethod,
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully.',
    data: { order },
  });
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await getUserOrdersService(req.user._id);

  res.json({
    success: true,
    message: 'Orders retrieved successfully.',
    data: { orders },
  });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await getAllOrdersService();

  res.json({
    success: true,
    message: 'Orders retrieved successfully.',
    data: { orders },
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await getOrderByIdService({
    orderMongoId: req.params.id,
    user: req.user,
  });

  res.json({
    success: true,
    message: 'Order retrieved successfully.',
    data: { order },
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) throw new AppError('status is required.', 400);

  const order = await updateOrderStatusService({
    orderMongoId: req.params.id,
    status,
  });

  res.json({
    success: true,
    message: 'Order status updated successfully.',
    data: { order },
  });
});
