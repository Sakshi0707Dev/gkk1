import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import seedsImg from '../assets/seeds.png';
import fertImg from '../assets/fertilizer.png';
import pestImg from '../assets/pesticides.png';
import toolsImg from '../assets/tools.png';
import organicImg from '../assets/organic.png';
import irrigationImg from '../assets/irrigation.png';

const categories = [
  { id: 1, tKey: 'cat_seeds', image: seedsImg },
  { id: 2, tKey: 'cat_fert', image: fertImg },
  { id: 3, tKey: 'cat_pest', image: pestImg },
  { id: 4, tKey: 'cat_tools', image: toolsImg },
  { id: 5, tKey: 'cat_org', image: organicImg },
  { id: 6, tKey: 'cat_irri', image: irrigationImg },
];

const CategoriesSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-agri-green pl-3">{t('cat_title')}</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="group cursor-pointer flex flex-col items-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-agri-green/30">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-100 p-1 border-2 border-transparent group-hover:border-agri-orange transition-colors">
                <img 
                  src={cat.image} 
                  alt={t(cat.tKey)} 
                  className="w-full h-full object-contain rounded-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-agri-green transition-colors text-sm text-center leading-tight max-w-full">
                {t(cat.tKey)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
