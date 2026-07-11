import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { ENV } from '../config/env.js';

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

console.log('[CLOUDINARY DEBUG]', {
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  secret_length: ENV.CLOUDINARY_API_SECRET?.length,
  secret_trimmed_length: ENV.CLOUDINARY_API_SECRET?.trim().length,
  has_whitespace: ENV.CLOUDINARY_API_SECRET !== ENV.CLOUDINARY_API_SECRET?.trim(),
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'gkk/products',
    resource_type: 'image',
    public_id: () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  },
});

export { cloudinary, storage };
