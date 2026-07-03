import Product from '../models/product.model.js';
import { AppError, asyncHandler } from '../utils/asyncHandler.js';

export const getProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;

  // DEBUG LOGS
  console.log('Fetching products for category:', category || 'All');

  // STRICT FILTERING: Use exact match, remove regex logic
  const filter = {};
  if (category) {
    filter.category = category;
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });

  // DEBUG LOGS
  console.log(`Found ${products.length} products for category: ${category || 'All'}`);

  res.json({
    success: true,
    message: 'Products retrieved successfully.',
    data: { products },
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, category, image } = req.body;

  if (!name || price == null || !category) {
    throw new AppError('name, price, and category are required.', 400);
  }

  const product = await Product.create({
    name: String(name).trim(),
    price: Number(price),
    category: String(category).trim(),
    image: image ? String(image).trim() : '',
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully.',
    data: { product },
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, category, image } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found.', 404);

  if (name !== undefined) product.name = String(name).trim();
  if (price !== undefined) product.price = Number(price);
  if (category !== undefined) product.category = String(category).trim();
  if (image !== undefined) product.image = String(image).trim();

  await product.save();

  res.json({
    success: true,
    message: 'Product updated successfully.',
    data: { product },
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new AppError('Product not found.', 404);

  res.json({
    success: true,
    message: 'Product deleted successfully.',
    data: { product },
  });
});
