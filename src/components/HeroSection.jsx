import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative w-full min-h-[450px] md:h-[500px] bg-agri-light overflow-hidden flex items-center">
      {/* Background Image Placeholder */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 md:opacity-40 mix-blend-multiply"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1628108520894-3d0d3d5fbaea?q=80&w=2670&auto=format&fit=crop')" }}
      ></div>
      
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-white via-white/90 md:via-white/80 to-transparent z-0"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-0">
        <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
          <span className="inline-block py-1 px-3 rounded-full bg-agri-green/10 text-agri-dark font-semibold text-xs md:text-sm mb-4 border border-agri-green/20 uppercase tracking-wider">
            {t('season')}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4 md:mb-6">
            {t('hero_title1')} <br className="hidden sm:block" />
            <span className="text-agri-green">{t('hero_highlight')}</span> {t('hero_title2')}
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
            {t('hero_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
            <button className="bg-agri-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-md shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 w-full sm:w-auto">
              {t('shop_now')}
            </button>
            <button className="bg-white hover:bg-gray-50 text-agri-dark border border-gray-200 font-bold py-3 px-8 rounded-md shadow-sm transition-all w-full sm:w-auto">
              {t('view_categories')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
