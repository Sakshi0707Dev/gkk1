import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { initialProducts } from '../data/products';

const formatTitle = (slug) =>
  String(slug || '')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const CategoryProducts = () => {
  const { category } = useParams();
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/products', { params: { category } });
        const apiProducts = res.data?.data?.products || [];

        if (apiProducts.length > 0) {
          setProducts(apiProducts);
        } else {
          const fallbackProducts = initialProducts
            .filter((p) => p.category === category)
            .map((p) => ({
              _id: String(p.id),
              name: p.name,
              price: Number(String(p.price).replace(/[^\d]/g, '')) || 0,
              image: p.image,
              category: p.category,
            }));

          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        const fallbackProducts = initialProducts
          .filter((p) => p.category === category)
          .map((p) => ({
            _id: String(p.id),
            name: p.name,
            price: Number(String(p.price).replace(/[^\d]/g, '')) || 0,
            image: p.image,
            category: p.category,
          }));
        setProducts(fallbackProducts);
        if (fallbackProducts.length === 0) {
          setError(err?.response?.data?.message || 'Unable to load products.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);

  const isInCart = (id) => cart.some((item) => String(item.id) === String(id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      <Link
        to="/"
        className="inline-flex items-center gap-2 mb-6 text-agri-green font-bold hover:text-green-700 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Home
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 capitalize tracking-tight flex items-center gap-3">
          <span className="w-2 h-10 bg-agri-green rounded-full" />
          {formatTitle(category)}
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Browse our premium range of {formatTitle(category)}
        </p>
      </div>

      {loading && <p className="text-gray-500 font-medium">Loading products...</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
              <div className="relative h-56 bg-white overflow-hidden p-4">
                <button
                  onClick={() => toggleWishlist({
                    id: product._id,
                    name: product.name,
                    price: `₹ ${Number(product.price || 0).toLocaleString()}`,
                    image: product.images?.[0] || product.image,
                  })}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all group/wishlist"
                >
                  <Heart
                    size={20}
                    className={`transition-colors ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/wishlist:text-red-500'}`}
                  />
                </button>
                <img
                  src={product.images?.[0] || product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              </div>
              <div className="p-5 flex flex-col flex-1 border-t border-gray-50">
                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-agri-green transition-colors">
                  {product.name}
                </h3>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-2xl font-black text-gray-900">
                    ₹ {Number(product.price || 0).toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart({
                      id: product._id,
                      name: product.name,
                      price: `₹ ${Number(product.price || 0).toLocaleString()}`,
                      image: product.images?.[0] || product.image || 'https://via.placeholder.com/150?text=No+Image',
                      category: product.category,
                    })}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                      isInCart(product._id)
                        ? 'bg-agri-green text-white shadow-md'
                        : 'border-2 border-agri-green text-agri-green hover:bg-agri-green hover:text-white'
                    }`}
                  >
                    <ShoppingCart size={18} />
                    {isInCart(product._id) ? 'Added' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="col-span-full text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-500">No products are available in this category yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
