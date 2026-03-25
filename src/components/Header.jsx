import React from 'react';
import { Search, Globe, Truck, Heart, User, ShoppingCart, Phone, Menu } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100 flex flex-col pt-0">
      {/* Top Strip */}
      <div className="bg-agri-dark text-white text-xs py-1.5 px-4 flex justify-between items-center sm:px-6 lg:px-8">
        <div className="flex space-x-4">
          <a href="#" className="hover:text-agri-orange transition-colors">{t('top_sell')}</a>
          <a href="#" className="hover:text-agri-orange transition-colors">{t('top_bulk')}</a>
        </div>
        <div className="flex items-center space-x-2">
          <Phone size={12} />
          <span>{t('top_call')} +91 92845 18038</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center space-x-3 shrink-0 cursor-pointer">
          <img 
            src="/logo.png.jpeg" 
            alt="Gawande Krushi Kendra Logo" 
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
          />
          <span className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-tight">Gawande Krushi Kendra</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-2 md:mx-6 min-w-[280px]">
          <div className="relative flex items-center w-full h-11 rounded-md border border-gray-300 bg-gray-50 overflow-hidden focus-within:border-agri-green focus-within:ring-1 focus-within:ring-agri-green transition-all shadow-inner">
            <input 
              type="text" 
              placeholder={t('search_placeholder')} 
              className="w-full h-full px-4 outline-none bg-transparent text-sm placeholder:text-gray-400"
            />
            <button className="h-full px-5 bg-agri-orange text-white hover:bg-orange-500 transition-colors flex items-center justify-center">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4 md:space-x-6 text-gray-600">
          <div onClick={toggleLanguage} className="flex flex-col items-center cursor-pointer hover:text-agri-green transition-colors hidden lg:flex group">
            <Globe size={22} className="mb-1 group-hover:scale-110 transition-transform text-agri-green" />
            <span className="text-[10px] font-medium uppercase text-agri-green">{language === 'en' ? 'EN / MAR' : 'MAR / EN'}</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-agri-green transition-colors hidden lg:flex group">
            <Truck size={22} className="mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium uppercase">{t('track_order')}</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-agri-green transition-colors hidden sm:flex group">
            <Heart size={22} className="mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium uppercase">{t('wishlist')}</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-agri-green transition-colors group">
            <User size={22} className="mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium uppercase">{t('login')}</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-agri-green transition-colors relative group">
            <ShoppingCart size={22} className="mb-1 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1.5 -right-2 bg-agri-orange text-white text-[10px] font-bold px-1.5 py-[1px] rounded-full shadow-sm">0</span>
            <span className="text-[10px] font-medium uppercase">{t('cart')}</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center space-x-8 overflow-x-auto no-scrollbar py-3 text-[13px] font-bold text-gray-700 whitespace-nowrap uppercase tracking-wide">
            <li className="flex items-center text-agri-green cursor-pointer hover:text-agri-dark transition-colors"><Menu size={18} className="mr-2" /> {t('nav_all')}</li>
            <li className="hover:text-agri-green cursor-pointer transition-colors">{t('nav_brands')}</li>
            <li className="hover:text-agri-green cursor-pointer transition-colors">{t('nav_seeds')}</li>
            <li className="hover:text-agri-green cursor-pointer transition-colors">{t('nav_crop_prot')}</li>
            <li className="hover:text-agri-green cursor-pointer transition-colors">{t('nav_crop_nutri')}</li>
            <li className="hover:text-agri-green cursor-pointer transition-colors">{t('nav_equip')}</li>
            <li className="hover:text-agri-green cursor-pointer transition-colors">{t('nav_animal')}</li>
            <li className="hover:text-agri-green cursor-pointer transition-colors">{t('nav_organic')}</li>
            <li className="hover:text-agri-green cursor-pointer transition-colors">{t('nav_services')}</li>
            <li className="hover:text-agri-green cursor-pointer transition-colors">{t('nav_blogs')}</li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
