import Product from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

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
