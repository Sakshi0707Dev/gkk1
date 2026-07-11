import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { ENV } from '../config/env.js';

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary config:");
console.log("Cloud name:", ENV.CLOUDINARY_CLOUD_NAME);
console.log("API key starts with:", ENV.CLOUDINARY_API_KEY?.slice(0, 6));
console.log("API secret length:", ENV.CLOUDINARY_API_SECRET?.length);
console.log(cloudinary.config());

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'gkk/products',
    resource_type: 'image',
    public_id: () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  },
});

export { cloudinary, storage };
