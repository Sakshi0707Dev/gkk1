import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    subcategory: { type: String, default: '', trim: true },
    brand: { type: String, default: '', trim: true },
    expiryDate: { type: Date, default: null },

    shortDescription: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },

    mrp: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    gst: { type: Number, default: 0, min: 0, max: 100 },

    stock: { type: Number, default: 0, min: 0 },
    lowStockAlert: { type: Number, default: 0, min: 0 },
    unit: { type: String, default: 'piece', trim: true },
    weight: { type: String, default: '', trim: true },

    image: { type: String, default: '', trim: true },
    images: { type: [String], default: [] },

    suitableCrops: [{ type: String, trim: true }],
    targetPests: [{ type: String, trim: true }],
    dosage: { type: String, default: '', trim: true },
    composition: { type: String, default: '', trim: true },
    benefits: { type: String, default: '', trim: true },
    safetyInstructions: { type: String, default: '', trim: true },

    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    limitedOffer: { type: Boolean, default: false },
    showOnBanner: { type: Boolean, default: false },
    bannerTitle: { type: String, default: '', trim: true },
    bannerSubtitle: { type: String, default: '', trim: true },
    bannerButtonText: { type: String, default: 'Shop Now', trim: true },

    status: {
      type: String,
      enum: ['draft', 'published', 'hidden'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

productSchema.index({ status: 1, featured: 1 });
productSchema.index({ status: 1, bestSeller: 1 });
productSchema.index({ status: 1, newArrival: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
