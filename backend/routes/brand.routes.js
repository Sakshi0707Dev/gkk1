import { Router } from 'express';
import {
  getActiveBrands,
  adminGetBrands,
  adminCreateBrand,
  adminUpdateBrand,
  adminDeleteBrand,
} from '../controllers/brand.controller.js';
import { authenticateAdmin } from '../middleware/admin.middleware.js';

const router = Router();

router.get('/', getActiveBrands);

router.get('/admin', authenticateAdmin, adminGetBrands);
router.post('/admin', authenticateAdmin, adminCreateBrand);
router.put('/admin/:id', authenticateAdmin, adminUpdateBrand);
router.delete('/admin/:id', authenticateAdmin, adminDeleteBrand);

export default router;
