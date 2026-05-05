import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import heroImage from '../assets/hero.webp';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative w-full min-h-[500px] md:min-h-[550px] bg-agri-light overflow-hidden flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 bg-black/30"></div>

      {/* Gradient for readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-0">
        <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
          <span className="inline-block py-1 px-3 rounded-full bg-green-500/20 text-white font-semibold text-xs md:text-sm mb-4 border border-green-400/30 uppercase tracking-wider">
            {t('season')}
          </span>
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-4 md:mb-6">
            {t('hero_title1')} <br className="hidden sm:block" />
            <span className="text-green-400">{t('hero_highlight')}</span> {t('hero_title2')}
          </h1>
          <p className="text-base md:text-lg text-gray-200 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
            {t('hero_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 hover:scale-105 w-full sm:w-auto">
              {t('shop_now')}
            </button>
            <button className="bg-white hover:bg-green-50 text-green-700 border border-green-600 font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto">
              {t('view_categories')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;