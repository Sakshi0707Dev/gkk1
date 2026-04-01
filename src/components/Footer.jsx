import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { MapPin, Phone } from 'lucide-react';
import { SiGmail } from 'react-icons/si';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#111827] text-gray-300 pt-16 pb-8 border-t border-agri-green/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* About Section */}
          <div className="col-span-1 md:col-span-2 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-white mb-6">
              <img
                src="/logo.png.jpeg"
                alt="Gawande Krushi Kendra Logo"
                className="w-10 h-10 md:w-12 md:h-12 object-contain bg-white p-1 rounded-lg"
              />
              <span className="text-xl md:text-2xl font-extrabold tracking-tight underline decoration-agri-green decoration-4 underline-offset-4">Gawande Krushi</span>
            </div>
            <p className="text-sm leading-relaxed max-w-md mx-auto md:mx-0">
              {t('about')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
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
          <div className="text-center md:text-left">
            <h3 className="text-white text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">{t('contact_info')}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start justify-center md:justify-start">
                <MapPin size={18} className="text-agri-orange mr-3 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed text-left">{t('address')}</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Phone size={18} className="text-agri-orange mr-3 flex-shrink-0" />
                <span>+91 92845 18038</span>
              </li>
              <li className="flex items-start justify-center md:justify-start">
                <SiGmail size={16} className="text-[#EA4335] mr-3 mt-1 flex-shrink-0" />
                <span className="break-all text-left">gawandekrushikendra@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-[10px] md:text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} {t('rights')}</p>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span className="line-through text-gray-700 text-xs hidden sm:inline" aria-hidden="true" title="Removed per requirements">Free Delivery</span>
            <span>{t('designed')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
