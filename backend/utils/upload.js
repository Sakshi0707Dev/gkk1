import multer from 'multer';
import { storage } from './cloudinary.js';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, jpeg, png, and webp files are allowed.'), false);
  }
};

export const uploadProductImages = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});
