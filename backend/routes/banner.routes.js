import { Router } from 'express';
import { uploadProductImages } from '../utils/upload.js';
import {
  getActiveBanners,
  adminGetBanners,
  adminCreateBanner,
  adminUpdateBanner,
  adminDeleteBanner,
} from '../controllers/banner.controller.js';
import { authenticateAdmin } from '../middleware/admin.middleware.js';

const router = Router();

router.get('/', getActiveBanners);

router.get('/admin', authenticateAdmin, adminGetBanners);
router.post('/admin', authenticateAdmin, uploadProductImages.single('image'), adminCreateBanner);
router.put('/admin/:id', authenticateAdmin, uploadProductImages.single('image'), adminUpdateBanner);
router.delete('/admin/:id', authenticateAdmin, adminDeleteBanner);

export default router;
