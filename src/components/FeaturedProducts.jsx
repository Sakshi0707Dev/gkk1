import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const products = [
  {
    id: 1,
    name: 'Pioneer 3302 Hybrid Corn Seed',
    price: '₹ 1,250',
    oldPrice: '₹ 1,400',
    rating: 4.8,
    image: 'https://cdn.shopify.com/s/files/1/0722/2059/files/fb-maruti-hybrid-corn-seeds-file-12698.png?v=1737448291'
  },
  {
    id: 2,
    name: 'Coromandel Gromor 10:26:26 NPK',
    price: '₹ 1,450',
    oldPrice: '₹ 1,600',
    rating: 4.5,
    image: 'https://5.imimg.com/data5/SELLER/Default/2024/6/431232812/WL/ZF/ZM/92588412/gromor-10-26-26-500x500.png'
  },
  {
    id: 3,
    name: 'Bayer Regent SC Insecticide',
    price: '₹ 850',
    oldPrice: '₹ 990',
    rating: 4.6,
    image: 'https://5.imimg.com/data5/SELLER/Default/2021/3/PJ/JI/PV/78408449/bayer-regent-sc-insecticide-1000x1000.jpg'
  },
  {
    id: 4,
    name: 'Syngenta Amistar Top Fungicide',
    price: '₹ 2,100',
    oldPrice: '₹ 2,350',
    rating: 4.9,
    image: 'https://cdn.shopify.com/s/files/1/0722/2059/files/amistar-top-fungicide-file-3949.jpg?v=1737470613&width=828&format=webp'
  }
];

const FeaturedProducts = () => {
  const { t } = useLanguage();
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isInCart = (id) => cart.some(item => item.id === id);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-agri-orange pl-3">{t('feat_title')}</h2>
          <a href="#blog" className="font-semibold text-agri-green text-sm hover:underline">{t('view_all')}</a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
              {/* Product Image */}
              <div className="relative h-56 bg-white overflow-hidden">
                <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                  {t('sale')}
                </span>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2 right-2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all group/wishlist"
                >
                  <Heart 
                    size={18} 
                    className={`transition-colors ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/wishlist:text-red-500'}`} 
                  />
                </button>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              
              {/* Product Info */}
              <div className="p-4 flex flex-col flex-1 border-t border-gray-50">
                <div className="flex items-center space-x-1 mb-2">
                  <Star size={14} className="fill-orange-400 text-orange-400" />
                  <span className="text-xs text-gray-500 font-medium">{product.rating}</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 leading-snug group-hover:text-agri-green transition-colors">
                  {product.name}
                </h3>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900">{product.price}</span>
                    <span className="text-xs text-gray-400 line-through">{product.oldPrice}</span>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-white border text-sm font-semibold border-agri-green text-agri-green hover:bg-agri-green hover:text-white rounded-md p-2 px-3 transition-colors flex items-center"
                  >
                    <ShoppingCart size={16} className="md:mr-2" />
                    <span className="hidden md:inline">
                      {isInCart(product.id) ? 'Added ✓' : (t('add') || 'ADD')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;