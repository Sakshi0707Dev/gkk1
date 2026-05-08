import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import seedsImg from '../assets/seeds.png';
import fertImg from '../assets/fertilizer.png';
import pestImg from '../assets/pesticides.png';
import vegetableSeedsImg from '../assets/categories/vegetable-seeds.svg';
import fruitSeedsImg from '../assets/categories/fruit-seeds.svg';
import flowerSeedsImg from '../assets/categories/flower-seeds.svg';
import herbsImg from '../assets/categories/herbs.svg';
import fertilizersCardImg from '../assets/categories/fertilizers.svg';
import cropProtectionImg from '../assets/categories/crop-protection.svg';
const categorySections = [
  {
    id: 'seeds',
    name: 'Seeds',
    image: seedsImg,
    subcategories: [
      { name: 'Vegetable Seeds', slug: 'vegetable-seeds', image: vegetableSeedsImg },
      { name: 'Fruit Seeds', slug: 'fruit-seeds', image: fruitSeedsImg },
      { name: 'Flower Seeds', slug: 'flower-seeds', image: flowerSeedsImg },
      { name: 'Herbs', slug: 'herbs', image: herbsImg },
    ],
  },
  {
    id: 'fertilizers',
    name: 'Fertilizers',
    image: fertImg,
    subcategories: [
      { name: 'NPK Fertilizers', slug: 'npk-fertilizers', image: fertilizersCardImg },
      { name: 'Urea', slug: 'urea', image: fertilizersCardImg },
      { name: 'DAP', slug: 'dap', image: fertilizersCardImg },
      { name: 'Micronutrients', slug: 'micronutrients', image: fertilizersCardImg },
    ],
  },
  {
    id: 'pesticides',
    name: 'Pesticides',
    image: pestImg,
    subcategories: [
      { name: 'Insecticides', slug: 'insecticides', image: cropProtectionImg },
      { name: 'Fungicides', slug: 'fungicides', image: cropProtectionImg },
      { name: 'Herbicides', slug: 'herbicides', image: cropProtectionImg },
      { name: 'Rodenticides', slug: 'rodenticides', image: cropProtectionImg },
    ],
  },
];

const CategoriesSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-agri-green pl-3">{t('cat_title')}</h2>
        
        <div className="space-y-8">
          {categorySections.map((section) => (
            <div key={section.id}>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <img src={section.image} alt="" className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                {section.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {section.subcategories.map((subcategory) => (
                  <Link 
                    key={subcategory.slug}
                    to={`/category/${subcategory.slug}`}
                    className="group cursor-pointer flex flex-col items-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-agri-green/30"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-gray-100 p-1 border-2 border-transparent group-hover:border-agri-orange transition-colors">
                      <img 
                        src={subcategory.image}
                        alt={subcategory.name} 
                        className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=Category'; }}
                      />
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-agri-green transition-colors text-xs text-center leading-tight">
                      {subcategory.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;