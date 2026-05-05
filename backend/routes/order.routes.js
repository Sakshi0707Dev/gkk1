import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id', protect, restrictTo('admin'), updateOrderStatus);
router.put('/update-status/:id', protect, restrictTo('admin'), updateOrderStatus);

export default router;
