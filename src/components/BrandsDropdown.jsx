import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronRight, ArrowRight } from 'lucide-react';

const brands = [
  { id: 1, name: 'Bayer', logo: 'https://placehold.co/120x60/0056b3/ffffff?text=Bayer', slug: 'bayer', verified: true },
  { id: 2, name: 'Syngenta', logo: 'https://placehold.co/120x60/007a33/ffffff?text=Syngenta', slug: 'syngenta', verified: true },
  { id: 3, name: 'BASF', logo: 'https://placehold.co/120x60/004d40/ffffff?text=BASF', slug: 'basf', verified: true },
  { id: 4, name: 'Corteva', logo: 'https://placehold.co/120x60/ff6b00/ffffff?text=Corteva', slug: 'corteva', verified: true },
  { id: 5, name: 'FMC', logo: 'https://placehold.co/120x60/e31837/ffffff?text=FMC', slug: 'fmc', verified: false },
  { id: 6, name: 'UPL', logo: 'https://placehold.co/120x60/00a651/ffffff?text=UPL', slug: 'upl', verified: true },
  { id: 7, name: 'Adama', logo: 'https://placehold.co/120x60/0066cc/ffffff?text=Adama', slug: 'adama', verified: false },
  { id: 8, name: 'Rallis', logo: 'https://placehold.co/120x60/ff6600/ffffff?text=Rallis', slug: 'rallis', verified: false },
  { id: 9, name: 'Gowan', logo: 'https://placehold.co/120x60/2d2d2d/ffffff?text=Gowan', slug: 'gowan', verified: false },
  { id: 10, name: 'Dupont', logo: 'https://placehold.co/120x60/001f6d/ffffff?text=Dupont', slug: 'dupont', verified: false },
  { id: 11, name: 'Arysta', logo: 'https://placehold.co/120x60/00ae9c/ffffff?text=Arysta', slug: 'arysta', verified: false },
  { id: 12, name: 'Crystal', logo: 'https://placehold.co/120x60/8b4513/ffffff?text=Crystal', slug: 'crystal', verified: false },
  { id: 13, name: 'Indofil', logo: 'https://placehold.co/120x60/1e3a8a/ffffff?text=Indofil', slug: 'indofil', verified: false },
  { id: 14, name: 'Dhanuka', logo: 'https://placehold.co/120x60/dc2626/ffffff?text=Dhanuka', slug: 'dhanuka', verified: false },
  { id: 15, name: 'Magellan', logo: 'https://placehold.co/120x60/059669/ffffff?text=Magellan', slug: 'magellan', verified: false },
  { id: 16, name: 'Tata Rallies', logo: 'https://placehold.co/120x60/7c3aed/ffffff?text=Tata+R', slug: 'tata-rallis', verified: false },
  { id: 17, name: 'Gharda', logo: 'https://placehold.co/120x60/ea580c/ffffff?text=Gharda', slug: 'gharda', verified: false },
  { id: 18, name: 'Biotax', logo: 'https://placehold.co/120x60/0891b2/ffffff?text=Biotax', slug: 'biotax', verified: false },
];

const BrandSkeleton = ({ isMobile = false }) => (
  <div className={`animate-pulse ${isMobile ? 'min-w-[100px]' : ''}`}>
    <div className={`bg-gray-200 rounded-xl border border-gray-100 ${isMobile ? 'p-3' : 'p-4'}`}>
      <div className={`bg-gray-300 rounded ${isMobile ? 'w-16 h-10 mb-2 mx-auto' : 'w-full h-14 mb-3'}`} />
      <div className="bg-gray-200 rounded h-3 w-12 mx-auto" />
    </div>
  </div>
);

const BrandsDropdown = ({ isOpen, onClose, activeBrand = null, onBrandSelect = () => {} }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentActiveBrand = activeBrand;

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setLoadedImages({});
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchQuery]);

  useEffect(() => {
    if (isOpen && searchInputRef.current && !isLoading) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isLoading]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleBrandClick = (slug) => {
    onBrandSelect(slug);
    localStorage.setItem('agri_active_brand', slug);
    window.location.href = `/brand/${slug}`;
  };

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  if (!isOpen) return (
    <div className="hidden">
      <div ref={dropdownRef} />
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      
      <div
        ref={dropdownRef}
        className="fixed left-0 right-0 top-auto mt-0 bg-white z-[100] shadow-2xl border-t border-gray-100 animate-slideDown lg:fixed lg:top-auto lg:mt-0 lg:left-0 lg:right-0"
      >
        <div className="max-w-7xl mx-auto">
          <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3 lg:px-6 lg:py-5">
            <div className="relative flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search brands..."
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-agri-green/50 focus:border-agri-green transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <X size={22} />
            </button>
          </div>

          <div className="lg:hidden px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              {isLoading ? 'Loading brands...' : `${filteredBrands.length} ${filteredBrands.length === 1 ? 'brand' : 'brands'}`}
            </span>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="flex items-center gap-1 text-sm font-medium text-agri-green"
            >
              {isMobileOpen ? 'Show Less' : 'View All'}
              <ChevronRight size={16} className={`transform transition-transform ${isMobileOpen ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {isLoading ? (
            <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-6 gap-4 p-6">
              {[...Array(12)].map((_, i) => <BrandSkeleton key={i} />)}
            </div>
          ) : (
            <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-6 gap-4 p-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
              {filteredBrands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => handleBrandClick(brand.slug)}
                  className={`group flex flex-col items-center p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 bg-white relative overflow-hidden ${
                    currentActiveBrand === brand.slug
                      ? 'border-agri-green border-2 shadow-lg shadow-agri-green/20'
                      : 'border-gray-100 hover:border-agri-green/40 hover:shadow-xl hover:shadow-agri-green/15'
                  }`}
                >
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-full h-14 flex items-center justify-center mb-3">
                    {!loadedImages[brand.id] && (
                      <div className="w-20 h-12 bg-gray-100 animate-pulse rounded" />
                    )}
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      loading="lazy"
                      onLoad={() => handleImageLoad(brand.id)}
                      className={`max-w-full max-h-full object-contain transition-all duration-300 ${loadedImages[brand.id] ? 'opacity-100' : 'opacity-0 absolute'}`}
                      style={{ opacity: loadedImages[brand.id] ? 1 : 0 }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-800 group-hover:text-agri-green transition-colors">
                    {brand.name}
                  </span>
                  {brand.verified && (
                    <span className="text-[10px] text-green-600 font-medium mt-0.5">Verified</span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
              {isLoading ? (
                [...Array(6)].map((_, i) => <BrandSkeleton key={i} isMobile />)
              ) : (
                filteredBrands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandClick(brand.slug)}
                    className={`group flex flex-col items-center p-3 rounded-lg border transition-all duration-200 bg-white ${
                      currentActiveBrand === brand.slug
                        ? 'border-agri-green border-2 shadow-md shadow-agri-green/20'
                        : 'border-gray-100 hover:border-agri-green/40 hover:shadow-md'
                    }`}
                  >
                    <div className="w-full h-10 flex items-center justify-center mb-2">
                      {!loadedImages[brand.id] ? (
                        <div className="w-16 h-10 bg-gray-100 animate-pulse rounded" />
                      ) : null}
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        loading="lazy"
                        onLoad={() => handleImageLoad(brand.id)}
                        className={`max-w-full max-h-full object-contain transition-all duration-200 ${loadedImages[brand.id] ? 'opacity-100' : 'opacity-0'}`}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${currentActiveBrand === brand.slug ? 'text-agri-green' : 'text-gray-700 group-hover:text-agri-green'}`}>
                      {brand.name}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {!isLoading && !isMobileOpen && (
            <div className="lg:hidden flex overflow-x-auto gap-3 p-4 no-scrollbar">
              {filteredBrands.slice(0, 6).map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => handleBrandClick(brand.slug)}
                  className={`group flex-shrink-0 flex flex-col items-center p-3 rounded-lg border transition-all duration-200 bg-white min-w-[100px] ${
                    currentActiveBrand === brand.slug
                      ? 'border-agri-green border-2 shadow-md shadow-agri-green/20'
                      : 'border-gray-100 hover:border-agri-green/40 hover:shadow-md'
                  }`}
                >
                  <div className="w-16 h-10 flex items-center justify-center mb-2">
                    {!loadedImages[brand.id] ? (
                      <div className="w-16 h-10 bg-gray-100 animate-pulse rounded" />
                    ) : null}
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      loading="lazy"
                      onLoad={() => handleImageLoad(brand.id)}
                      className={`max-w-full max-h-full object-contain transition-all duration-200 ${loadedImages[brand.id] ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${currentActiveBrand === brand.slug ? 'text-agri-green' : 'text-gray-700 group-hover:text-agri-green'}`}>
                    {brand.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {filteredBrands.length === 0 && !isLoading && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No brands found</p>
              <p className="text-gray-400 text-sm mt-1">Try searching with different keywords</p>
            </div>
          )}

          <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50 lg:px-6 lg:py-5 flex justify-center">
            <button
              onClick={() => window.location.href = '/brands'}
              className="flex items-center gap-2 px-6 py-2.5 bg-agri-green text-white font-semibold rounded-lg hover:bg-agri-dark transition-colors duration-300 shadow-lg shadow-agri-green/20 group"
            >
              View All Brands
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </>
  );
};

export default BrandsDropdown;