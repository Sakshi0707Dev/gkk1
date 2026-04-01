import React, { useState, useEffect } from 'react';
import { Search, Globe, Truck, Heart, ShoppingCart, Phone, Menu, X, ChevronRight, LogOut } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import LoginModal from './LoginModal';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Helper: get initials from a name
const getInitials = (name = '') => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

// Avatar circle — shows initials, or Google photo if available
const UserAvatar = ({ user, size = 'md' }) => {
  const initials = getInitials(user.name);
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';

  if (user.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt={user.name}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-white shadow`}
      />
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-agri-green text-white flex items-center justify-center font-bold ring-2 ring-white shadow select-none`}>
      {initials}
    </div>
  );
};

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // On mount: check localStorage and silently verify the JWT with /api/me
  useEffect(() => {
    const savedUser = localStorage.getItem('agri_user');
    const token = localStorage.getItem('agri_token');

    if (savedUser && token) {
      // Optimistically set user from cache, then verify with server
      setUser(JSON.parse(savedUser));

      // Skip verification for mock Google tokens (no real backend for those)
      if (!token.startsWith('google_token_')) {
        axios.get(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          // Update with fresh data from server
          const freshUser = res.data.data.user;
          setUser(freshUser);
          localStorage.setItem('agri_user', JSON.stringify(freshUser));
        }).catch(() => {
          // Token is invalid/expired — clear auth state
          localStorage.removeItem('agri_token');
          localStorage.removeItem('agri_user');
          setUser(null);
        });
      }
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLoginSuccess = (userData) => setUser(userData);

  const handleLogout = async () => {
    const token = localStorage.getItem('agri_token');
    try {
      if (token && !token.startsWith('google_token_')) {
        await axios.post(`${API_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Ignore errors — we always clear client-side regardless
    } finally {
      localStorage.removeItem('agri_token');
      localStorage.removeItem('agri_user');
      setUser(null);
    }
  };

  return (
    <header className="relative w-full bg-white shadow-sm border-b border-gray-100 flex flex-col pt-0 z-50">
      {/* Top Strip */}
      <div className="bg-agri-dark text-white text-[10px] sm:text-xs py-1.5 px-4 flex justify-between items-center sm:px-6 lg:px-8">
        <div className="flex space-x-3 sm:space-x-4">
          <a href="#" className="hover:text-agri-orange transition-colors">{t('top_sell')}</a>
          <a href="#" className="hover:text-agri-orange transition-colors hidden xs:inline">{t('top_bulk')}</a>
        </div>
        <div className="flex items-center space-x-2">
          <Phone size={10} className="sm:w-3 sm:h-3" />
          <span>{t('top_call')} +919021605445</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="py-3 md:py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex items-center justify-between gap-2 md:gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="lg:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2 md:space-x-3 shrink-0 cursor-pointer">
          <img
            src="/logo.png.jpeg"
            alt="Gawande Krushi Kendra Logo"
            className="w-10 h-10 md:w-16 md:h-16 object-contain"
          />
          <span className="text-lg md:text-2xl font-extrabold text-gray-800 tracking-tight hidden xs:block">
            Gawande <span className="text-agri-green">Krushi</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-1 md:mx-6 hidden sm:block">
          <div className="relative flex items-center w-full h-10 md:h-11 rounded-md border border-gray-300 bg-gray-50 overflow-hidden focus-within:border-agri-green focus-within:ring-1 focus-within:ring-agri-green transition-all shadow-inner">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              className="w-full h-full px-4 outline-none bg-transparent text-sm placeholder:text-gray-400"
            />
            <button className="h-full px-4 md:px-5 bg-agri-orange text-white hover:bg-orange-500 transition-colors flex items-center justify-center">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 text-gray-600">

          {/* Language */}
          <div onClick={toggleLanguage} className="relative flex flex-col items-center cursor-pointer group hidden lg:flex">
            <div className="p-2 rounded-full group-hover:bg-agri-green/10 transition-all duration-300 group-hover:-translate-y-1">
              <Globe size={22} className="group-hover:text-agri-green transition-colors" />
            </div>
            <span className="absolute -bottom-4 text-[9px] font-bold uppercase text-agri-green opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 whitespace-nowrap">
              {language === 'en' ? 'EN / MAR' : 'MAR / EN'}
            </span>
          </div>

          {/* Mobile Search */}
          <button className="sm:hidden p-2 text-gray-600 hover:text-agri-green hover:bg-agri-green/10 rounded-full transition-all duration-300 group">
            <Search size={22} className="group-hover:scale-110 transition-transform" />
          </button>

          {/* Track Order */}
          <div className="relative flex flex-col items-center cursor-pointer group hidden xl:flex">
            <div className="p-2 rounded-full group-hover:bg-agri-green/10 transition-all duration-300 group-hover:-translate-y-1">
              <Truck size={22} className="group-hover:text-agri-green transition-colors" />
            </div>
            <span className="absolute -bottom-4 text-[9px] font-bold uppercase text-agri-green opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 whitespace-nowrap">
              {t('track_order')}
            </span>
          </div>

          {/* Wishlist */}
          <div className="relative flex flex-col items-center cursor-pointer group hidden sm:flex">
            <div className="p-2 rounded-full group-hover:bg-agri-green/10 transition-all duration-300 group-hover:-translate-y-1">
              <Heart size={22} className="group-hover:text-agri-green transition-colors" />
            </div>
            <span className="absolute -bottom-4 text-[9px] font-bold uppercase text-agri-green opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 whitespace-nowrap">
              {t('wishlist')}
            </span>
          </div>

          {/* ── Account Button ── */}
          <div
            onClick={() => !user && setIsLoginModalOpen(true)}
            className="relative flex flex-col items-center cursor-pointer group"
          >
            <div className="flex items-center gap-2 p-1 md:p-1.5 rounded-full group-hover:bg-agri-green/10 transition-all duration-300">
              {user ? (
                <>
                  <UserAvatar user={user} size="md" />
                  <span className="text-sm font-bold text-gray-800 hidden md:block max-w-[90px] truncate leading-none">
                    {user.name.split(' ')[0]}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full group-hover:bg-agri-green/10 transition-all duration-300 group-hover:-translate-y-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-agri-green transition-colors">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <span className="absolute -bottom-4 text-[9px] font-bold uppercase text-agri-green opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 whitespace-nowrap">
                    {t('login')}
                  </span>
                </div>
              )}
            </div>

            {/* Dropdown — only visible when logged in */}
            {user && (
              <div className="absolute top-full right-0 mt-2 w-60 bg-white border border-gray-100 shadow-2xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] transform translate-y-2 group-hover:translate-y-0">
                <div className="px-4 py-3 border-b border-gray-50 mb-2 flex items-center gap-3">
                  <UserAvatar user={user} size="md" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase text-agri-green tracking-wider mb-0.5">Welcome back</p>
                    <p className="text-sm font-extrabold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="px-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
                  >
                    <div className="p-1.5 bg-red-100 rounded-lg">
                      <LogOut size={14} />
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="relative flex flex-col items-center cursor-pointer group">
            <div className="p-2 rounded-full group-hover:bg-agri-green/10 transition-all duration-300 group-hover:-translate-y-1 relative">
              <ShoppingCart size={22} className="group-hover:text-agri-green transition-colors" />
              <span className="absolute top-1 right-1 bg-agri-orange text-white text-[10px] font-bold px-1.5 py-[1px] rounded-full shadow-sm ring-2 ring-white">0</span>
            </div>
            <span className="absolute -bottom-4 text-[9px] font-bold uppercase text-agri-green opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 whitespace-nowrap">
              {t('cart')}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
      <nav className="border-t border-gray-100 bg-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center space-x-8 py-3 text-[13px] font-bold text-gray-700 whitespace-nowrap uppercase tracking-wide overflow-x-auto no-scrollbar">
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

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={toggleMenu} />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[60] lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-agri-green text-white">
          <div className="flex items-center space-x-2">
            <img src="/logo.png.jpeg" alt="Logo" className="w-8 h-8 bg-white p-0.5 rounded-md" />
            <span className="font-bold">Gawande Krushi</span>
          </div>
          <button onClick={toggleMenu} className="p-1 hover:bg-white/10 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <div onClick={toggleLanguage} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50">
            <div className="flex items-center space-x-3 text-gray-700">
              <Globe size={20} className="text-agri-green" />
              <span className="font-medium">{language === 'en' ? 'English' : 'मराठी'}</span>
            </div>
            <span className="text-[10px] font-bold text-agri-green bg-agri-green/10 px-2 py-0.5 rounded uppercase">
              {language === 'en' ? 'Switch to Marathi' : 'इंग्रजीमध्ये बदला'}
            </span>
          </div>

          <div className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('nav_all')}</div>
          <ul className="text-sm font-semibold text-gray-700">
            {[t('nav_brands'), t('nav_seeds'), t('nav_crop_prot'), t('nav_crop_nutri'), t('nav_equip'), t('nav_animal'), t('nav_organic')].map((label) => (
              <li key={label} className="flex items-center justify-between px-4 py-3 hover:bg-agri-light hover:text-agri-green cursor-pointer transition-colors border-l-4 border-transparent hover:border-agri-green">
                <span>{label}</span>
                <ChevronRight size={16} className="text-gray-300" />
              </li>
            ))}
          </ul>

          <div className="mt-4 px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Account & More</div>
          <ul className="text-sm font-semibold text-gray-700">
            <li className="flex items-center space-x-3 px-4 py-3 hover:bg-agri-light text-gray-600">
              <Truck size={18} /><span>{t('track_order')}</span>
            </li>
            <li className="flex items-center space-x-3 px-4 py-3 hover:bg-agri-light text-gray-600">
              <Heart size={18} /><span>{t('wishlist')}</span>
            </li>
            <li className="flex items-center space-x-3 px-4 py-3 hover:bg-agri-light text-gray-600">
              <Phone size={18} /><span>Contact Support</span>
            </li>
          </ul>
        </div>

        {/* Mobile drawer footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <UserAvatar user={user} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white font-bold py-2.5 rounded-md shadow-md flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setIsLoginModalOpen(true); setIsMenuOpen(false); }}
                className="w-full bg-agri-green text-white font-bold py-2.5 rounded-md shadow-md"
              >
                {t('login')}
              </button>
              <button
                onClick={() => { setIsLoginModalOpen(true); setIsMenuOpen(false); }}
                className="w-full bg-white border-2 border-agri-green text-agri-green font-bold py-2.5 rounded-md"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </header>
  );
};

export default Header;