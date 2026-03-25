import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#111827] text-gray-300 pt-16 pb-8 border-t border-agri-green/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* About Section */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2 text-white mb-6">
              <img 
                src="/logo.png.jpeg" 
                alt="Gawande Krushi Kendra Logo" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain bg-white p-1 rounded-lg"
              />
              <span className="text-2xl font-extrabold tracking-tight">Gawande Krushi Kendra</span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              {t('about')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">{t('quick_links')}</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-agri-green transition-colors">{t('about_us')}</a></li>
              <li><a href="#" className="hover:text-agri-green transition-colors">{t('return_policy')}</a></li>
              <li><a href="#" className="hover:text-agri-green transition-colors">{t('terms')}</a></li>
              <li><a href="#" className="hover:text-agri-green transition-colors">{t('privacy')}</a></li>
              <li><span className="text-xs text-gray-500 mt-2 block">{t('terms_apply')}</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">{t('contact_info')}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <span className="text-agri-orange mr-3 font-bold mt-0.5">A</span>
                <span className="leading-relaxed">{t('address')}</span>
              </li>
              <li className="flex items-center">
                <span className="text-agri-orange mr-3 font-bold">P</span>
                <span>+91 92845 18038</span>
              </li>
              <li className="flex items-center">
                <span className="text-agri-orange mr-3 font-bold">E</span>
                <span>ashutoshgawande.gpb@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} {t('rights')}</p>
          <div className="mt-4 md:mt-0">
            <span className="line-through text-gray-700 mr-4 text-xs" aria-hidden="true" title="Removed per requirements">Free Delivery</span>
            <span>{t('designed')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
