import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const products = [
  {
    id: 1,
    name: 'Pioneer 3302 Hybrid Corn Seed',
    price: '₹ 1,250',
    oldPrice: '₹ 1,400',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    name: 'Coromandel Gromor 10:26:26 NPK',
    price: '₹ 1,450',
    oldPrice: '₹ 1,600',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    name: 'Bayer Regent SC Insecticide',
    price: '₹ 850',
    oldPrice: '₹ 990',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 4,
    name: 'Syngenta Amistar Top Fungicide',
    price: '₹ 2,100',
    oldPrice: '₹ 2,350',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=400'
  }
];

const FeaturedProducts = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-agri-orange pl-3">{t('feat_title')}</h2>
          <a href="#" className="font-semibold text-agri-green text-sm hover:underline">{t('view_all')}</a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
              {/* Product Image */}
              <div className="relative h-56 bg-white overflow-hidden">
                <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                  {t('sale')}
                </span>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
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
                  <button className="bg-white border text-sm font-semibold border-agri-green text-agri-green hover:bg-agri-green hover:text-white rounded-md p-2 px-3 transition-colors flex items-center">
                    <ShoppingCart size={16} className="md:mr-2" />
                    <span className="hidden md:inline">{t('add')}</span>
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
