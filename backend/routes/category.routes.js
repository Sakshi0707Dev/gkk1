import { Router } from 'express';
import {
  getActiveCategories,
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from '../controllers/category.controller.js';
import { authenticateAdmin } from '../middleware/admin.middleware.js';

const router = Router();

router.get('/', getActiveCategories);

router.get('/admin', authenticateAdmin, adminGetCategories);
router.post('/admin', authenticateAdmin, adminCreateCategory);
router.put('/admin/:id', authenticateAdmin, adminUpdateCategory);
router.delete('/admin/:id', authenticateAdmin, adminDeleteCategory);

export default router;
