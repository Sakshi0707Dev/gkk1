import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const categories = [
  { id: 1, tKey: 'cat_seeds', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=300' },
  { id: 2, tKey: 'cat_fert', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=300' },
  { id: 3, tKey: 'cat_pest', image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=80&w=300' },
  { id: 4, tKey: 'cat_tools', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=300' },
  { id: 5, tKey: 'cat_org', image: 'https://images.unsplash.com/photo-1544985361-b420d7a77043?auto=format&fit=crop&q=80&w=300' },
  { id: 6, tKey: 'cat_irri', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=300' },
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
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-agri-green transition-colors text-sm text-center">
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
