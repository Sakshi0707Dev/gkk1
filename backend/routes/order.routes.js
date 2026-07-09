import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', protect, createOrder);
router.get('/', protect, restrictTo('admin'), getAllOrders);
router.get('/my', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id', protect, restrictTo('admin'), updateOrderStatus);
router.put('/update-status/:id', protect, restrictTo('admin'), updateOrderStatus);

export default router;
