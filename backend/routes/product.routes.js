import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../controllers/product.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getProducts);

router.post('/', protect, restrictTo('admin'), createProduct);
router.put('/:id', protect, restrictTo('admin'), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

export default router;
