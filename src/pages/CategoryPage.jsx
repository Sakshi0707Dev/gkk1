import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { initialProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { Plus, X, ShoppingCart, Image as ImageIcon, Heart } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams();
  const { addToCart, cart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    category: category || ''
  });

  const isAdmin = user?.email === 'gawandekrushikendra@gmail.com';
  const filteredProducts = products.filter(p => p.category === category);
  const isInCart = (id) => cart.some(item => item.id === id);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const id = Date.now();
    const productToAdd = {
      ...newProduct,
      id,
      price: newProduct.price.startsWith('₹') ? newProduct.price : `₹ ${newProduct.price}`,
      image: newProduct.image || 'https://via.placeholder.com/150?text=No+Image'
    };
    setProducts([...products, productToAdd]);
    setIsModalOpen(false);
    setNewProduct({ name: '', price: '', image: '', category });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 mb-6 text-agri-green font-bold hover:text-green-700 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> 
        Back to Home
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 capitalize tracking-tight flex items-center gap-3">
            <span className="w-2 h-10 bg-agri-green rounded-full"></span>
            {category?.replace('-', ' ')}
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Browse our premium range of {category?.replace('-', ' ')}</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => {
              setNewProduct({...newProduct, category});
              setIsModalOpen(true);
            }}
            className="bg-agri-green text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200 active:scale-95"
          >
            <Plus size={20} /> Add New Product
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
            <div className="relative h-56 bg-white overflow-hidden p-4">
              <button 
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all group/wishlist"
              >
                <Heart 
                  size={20} 
                  className={`transition-colors ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/wishlist:text-red-500'}`} 
                />
              </button>
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'}
              />
            </div>
            <div className="p-5 flex flex-col flex-1 border-t border-gray-50">
              <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-agri-green transition-colors">
                {product.name}
              </h3>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="text-2xl font-black text-gray-900">{product.price}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                    isInCart(product.id)
                      ? 'bg-agri-green text-white shadow-md'
                      : 'border-2 border-agri-green text-agri-green hover:bg-agri-green hover:text-white'
                  }`}
                >
                  <ShoppingCart size={18} />
                  {isInCart(product.id) ? 'Added' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="max-w-xs mx-auto">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Be the first to add a product to this category!</p>
              {isAdmin && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-agri-green font-bold hover:underline"
                >
                  Add Product Now
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Add Product</h2>
                <p className="text-gray-500 text-sm font-medium">Listing in <span className="text-agri-green capitalize">{category}</span></p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Product Name</label>
                <input 
                  required
                  placeholder="e.g. Premium Crop Booster"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-agri-green focus:bg-white rounded-xl px-4 py-3 outline-none transition-all font-medium"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                  <input 
                    required
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-agri-green focus:bg-white rounded-xl px-9 py-3 outline-none transition-all font-bold"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Image URL</label>
                <div className="relative">
                  <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    required
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-agri-green focus:bg-white rounded-xl px-11 py-3 outline-none transition-all font-medium text-sm"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 ml-1">Paste a direct link to an image file.</p>
              </div>
              
              {newProduct.image && (
                <div className="mt-2 rounded-xl border-2 border-gray-100 p-2 bg-gray-50">
                   <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1 tracking-wider">Preview</p>
                   <img 
                    src={newProduct.image} 
                    alt="Preview" 
                    className="w-full h-32 object-contain rounded-lg bg-white"
                    onError={(e) => e.target.style.display = 'none'}
                   />
                </div>
              )}

              <button className="w-full bg-agri-green text-white font-black py-4 rounded-xl shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-[0.98] mt-4">
                List Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;