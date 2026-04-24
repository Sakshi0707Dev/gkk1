import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, CloudSun, BookOpen, Lightbulb, Award } from 'lucide-react';

const menuItems = [
  { id: 'all', label: 'All Categories' },
  { id: 'seeds', label: 'Seeds' },
  { id: 'cropProtection', label: 'Crop Protection' },
  { id: 'cropNutrition', label: 'Crop Nutrition' },
  { id: 'equipment', label: 'Farming Equipment' },
  { id: 'organic', label: 'Organic' },
  { id: 'gallery', label: 'Gallery', href: '/gallery' },
  { id: 'resources', label: 'Resources' },
];

const dropdownContent = {
  all: [
    { label: 'Seeds', href: '/seeds' },
    { label: 'Crop Protection', href: '/crop-protection' },
    { label: 'Crop Nutrition', href: '/crop-nutrition' },
    { label: 'Farming Equipment', href: '/equipment' },
    { label: 'Organic Products', href: '/organic' },
  ],
  seeds: [
    { label: 'Vegetable Seeds', href: '/seeds/vegetable' },
    { label: 'Fruit Seeds', href: '/seeds/fruit' },
    { label: 'Flower Seeds', href: '/seeds/flower' },
    { label: 'Herbs', href: '/seeds/herbs' },
  ],
  cropProtection: [
    { label: 'Pesticides', href: '/crop-protection/pesticides' },
    { label: 'Insecticides', href: '/crop-protection/insecticides' },
    { label: 'Fungicides', href: '/crop-protection/fungicides' },
    { label: 'Herbicides', href: '/crop-protection/herbicides' },
  ],
  cropNutrition: [
    { label: 'Fertilizers', href: '/crop-nutrition/fertilizers' },
    { label: 'Micronutrients', href: '/crop-nutrition/micronutrients' },
    { label: 'Organic Manure', href: '/crop-nutrition/organic' },
    { label: 'Growth Promoters', href: '/crop-nutrition/growth' },
  ],
  equipment: [
    { label: 'Sprayers', href: '/equipment/sprayers' },
    { label: 'Farming Equipment', href: '/equipment/tools' },
    { label: 'Irrigation', href: '/equipment/irrigation' },
    { label: 'Harvesting Tools', href: '/equipment/harvesting' },
  ],
  organic: [
    { label: 'Organic Seeds', href: '/organic/seeds' },
    { label: 'Organic Fertilizers', href: '/organic/fertilizers' },
    { label: 'Organic Pesticides', href: '/organic/pesticides' },
    { label: 'Organic Manure', href: '/organic/manure' },
  ],
  resources: [
    { label: 'Weather Updates', href: '/weather', icon: CloudSun },
    { label: 'Crop Advisory Blog', href: '/blog', icon: BookOpen },
    { label: 'Seasonal Crop Tips', href: '/tips', icon: Lightbulb },
    { label: 'Government Schemes', href: '/schemes', icon: Award },
  ],
  services: [
    { label: 'Soil Testing', href: '/services/soil-testing' },
    { label: 'Crop Consulting', href: '/services/consulting' },
    { label: 'Farm Setup', href: '/services/farm-setup' },
    { label: 'Delivery Services', href: '/services/delivery' },
  ],
};

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState(null);
  const navbarRef = useRef(null);

  const handleMouseEnter = (menuId) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setActiveMenu(menuId);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsDropdownOpen(false);
      setActiveMenu(null);
    }, 200);
    setCloseTimeout(timeout);
  };

  const handleDropdownMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setIsDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsDropdownOpen(false);
      setActiveMenu(null);
    }, 200);
    setCloseTimeout(timeout);
  };

  const handleClick = (menuId) => {
    if (activeMenu === menuId && isDropdownOpen) {
      setIsDropdownOpen(false);
      setActiveMenu(null);
    } else {
      setActiveMenu(menuId);
      setIsDropdownOpen(true);
    }
  };

  return (
    <nav 
      className="border-t border-gray-100 bg-white hidden lg:block shadow-sm"
      ref={navbarRef}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <ul className="flex items-center justify-center gap-4 md:gap-8 py-3 text-[13px] font-bold text-gray-700 whitespace-nowrap uppercase tracking-wide">
          {menuItems.map((item) => (
            <li 
              key={item.id}
              className="relative px-3 py-2"
              onMouseEnter={() => handleMouseEnter(item.id)}
              onClick={() => handleClick(item.id)}
            >
              {item.href ? (
                <Link 
                  to={item.href}
                  className="flex items-center gap-1 cursor-pointer transition-colors duration-300 hover:text-green-700"
                >
                  <span>{item.label}</span>
                </Link>
              ) : (
                <div className={`flex items-center gap-1 cursor-pointer transition-colors duration-300 ${
                  activeMenu === item.id ? 'text-green-700 font-semibold' : 'hover:text-green-700'
                }`}>
                  <span>{item.label}</span>
                  {dropdownContent[item.id] && (
                    <ChevronDown size={12} className={`transition-transform duration-300 ${
                      activeMenu === item.id && isDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  )}
                </div>
              )}

              {dropdownContent[item.id] && isDropdownOpen && activeMenu === item.id && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-1 min-w-[220px] bg-white border border-gray-200 shadow-lg rounded-lg py-2 opacity-100 visible transition-all duration-300 z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  {dropdownContent[item.id].map((subItem, index) => {
                    const IconComponent = subItem.icon;
                    return (
                      <Link
                        key={index}
                        to={subItem.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                      >
                        {IconComponent && <IconComponent size={16} className="text-green-600" />}
                        {subItem.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;