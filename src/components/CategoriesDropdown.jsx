import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bug, 
  Leaf, 
  Droplets, 
  Zap, 
  Sun,
  Search,
  ChevronRight,
  CircleDot
} from 'lucide-react';

const categories = [
  {
    id: 'seeds',
    name: 'Seeds',
    icon: Bug,
    subcategories: [
      { id: 'vegetable-seeds', name: 'Vegetable Seeds', slug: 'category/vegetable-seeds' },
      { id: 'fruit-seeds', name: 'Fruit Seeds', slug: 'category/fruit-seeds' },
      { id: 'flower-seeds', name: 'Flower Seeds', slug: 'category/flower-seeds' },
      { id: 'herbs', name: 'Herbs', slug: 'category/herbs' },
    ]
  },
  {
    id: 'crop-nutrition',
    name: 'Crop Nutrition',
    icon: Leaf,
    subcategories: [
      { id: 'npk', name: 'NPK (Nitrogen, Phosphorus, Potassium)', slug: 'crop-nutrition/npk' },
      { id: 'micro-fertilizers', name: 'Micro Fertilizers', slug: 'crop-nutrition/micro-fertilizers' },
    ]
  },
  {
    id: 'equipments',
    name: 'Equipments',
    icon: Zap,
    subcategories: [
      { id: 'oil', name: 'Oil', slug: 'equipments/oil' },
      { id: 'yellow-sticky-trap', name: 'Yellow Sticky Trap', slug: 'equipments/yellow-sticky-trap' },
      { id: 'blue-sticky-trap', name: 'Blue Sticky Trap', slug: 'equipments/blue-sticky-trap' },
      { id: 'light-trap', name: 'Light Trap', slug: 'equipments/light-trap' },
      { id: 'fumigation-trap', name: 'Fumigation Trap', slug: 'equipments/fumigation-trap' },
    ]
  },
  {
    id: 'organic',
    name: 'Organic',
    icon: Sun,
    subcategories: [
      { id: 'bio-products', name: 'All Bio Products', slug: 'organic/bio-products' },
    ]
  },
];

const CategoriesDropdown = ({ isOpen, onClose, selectedCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const dropdownRef = useRef(null);

  const filteredCategories = categories.map(cat => ({
    ...cat,
    subcategories: cat.subcategories.filter(sub => 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.subcategories.length > 0);

  const activeCategory = selectedCategory === 'all' 
    ? categories[0]?.id 
    : selectedCategory || categories[0]?.id;

  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      setExpandedCategory(selectedCategory);
    }
  }, [selectedCategory]);

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
          {/* Search */}
          <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3 lg:px-6 lg:py-5">
            <div className="relative flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-agri-green/50 focus:border-agri-green transition-all"
                />
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight size={22} className="rotate-90" />
            </button>
          </div>

          {/* Mobile Accordion */}
          <div className="lg:hidden">
            {categories.map((category) => (
              <div key={category.id} className="border-b border-gray-100">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <category.icon size={20} className="text-agri-green" />
                    <span className="font-semibold text-gray-800">{category.name}</span>
                  </div>
                  <ChevronRight 
                    size={18} 
                    className={`text-gray-400 transition-transform ${expandedCategory === category.id ? 'rotate-90' : ''}`} 
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${expandedCategory === category.id ? 'max-h-[500px]' : 'max-h-0'}`}>
                  <div className="px-4 pb-4 space-y-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/${sub.slug}`}
                        onClick={onClose}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-agri-green/5 transition-colors text-left"
                      >
                        <CircleDot size={12} className="text-green-500" />
                        <span className="text-sm text-gray-600 font-medium">{sub.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Mega Menu */}
          <div className="hidden lg:grid gap-0 p-0">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div 
                  key={category.id} 
                  className={`p-6 border-r border-gray-100 hover:bg-gray-50/50 transition-colors ${category.id === selectedCategory ? 'bg-agri-green/5 border-b-2 border-b-agri-green' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-agri-green/10 rounded-lg">
                      <Icon size={20} className="text-agri-green" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                      {category.name}
                    </h3>
                  </div>
                  <ul className="space-y-1">
                    {category.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          to={`/${sub.slug}`}
                          onClick={onClose}
                          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left hover:bg-agri-green/10 hover:text-agri-green transition-all group"
                        >
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-agri-green transition-colors" />
                          <span className="text-sm text-gray-600 group-hover:text-agri-green font-medium">
                            {sub.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-600 font-medium">No categories found</p>
            </div>
          )}
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
      `}</style>
    </>
  );
};

export default CategoriesDropdown;