import { Router } from 'express';
import { uploadProductImages } from '../utils/upload.js';
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
} from '../controllers/product.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductBySlug);

router.post('/', protect, restrictTo('admin'), uploadProductImages.array('images', 10), createProduct);
router.put('/:id', protect, restrictTo('admin'), uploadProductImages.array('images', 10), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

export default router;
