import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import { SiGmail } from 'react-icons/si';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#111827] text-gray-300 py-6 px-6 border-t border-agri-green/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - About */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-white mb-3">
              <img
                src="/logo.png.jpeg"
                alt="Gawande Krushi Kendra Logo"
                className="w-8 h-8 object-contain bg-white p-1 rounded-lg"
              />
              <span className="text-lg font-extrabold tracking-tight">Gawande Krushi Kendra</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs mx-auto md:mx-0 text-gray-400">
              {t('about')}
            </p>
          </div>

          {/* Middle Column - Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-white text-sm font-bold mb-3 border-b border-gray-700 pb-2 inline-block">{t('quick_links')}</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-agri-green transition-colors">{t('about_us')}</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-agri-green transition-colors">Shipping Policy</Link></li>
              <li><a href="#" className="hover:text-agri-green transition-colors">{t('return_policy')}</a></li>
              <li><a href="#" className="hover:text-agri-green transition-colors">{t('terms')}</a></li>
              <li><a href="#" className="hover:text-agri-green transition-colors">{t('privacy')}</a></li>
            </ul>
          </div>

          {/* Right Column - Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-white text-sm font-bold mb-3 border-b border-gray-700 pb-2 inline-block">{t('contact_info')}</h3>
            <ul className="space-y-2 text-xs mb-3">
              <li className="flex items-center justify-center md:justify-start group">
                <MapPin size={14} className="text-agri-orange mr-2 flex-shrink-0" />
                <span className="text-gray-400">{t('address')}</span>
              </li>
              <li className="flex items-center justify-center md:justify-start group">
                <Phone size={14} className="text-agri-orange mr-2 flex-shrink-0" />
                <a href="tel:+919284518038" className="hover:text-white transition-colors">+91 92845 18038</a>
              </li>
              <li className="flex items-center justify-center md:justify-start group">
                <SiGmail size={14} className="text-[#EA4335] mr-2 flex-shrink-0" />
                <a href="mailto:gawandekrushikendra@gmail.com" className="hover:text-white transition-colors text-xs">
                  gawandekrushikendra@gmail.com
                </a>
              </li>
            </ul>
            
            <div className="relative mt-2">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3747.5518099029755!2d76.3340157!3d20.069207199999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bda71ebb78e9af9%3A0x737b701f073f731a!2sGawande%20kurshi%20kendra!5e0!3m2!1sen!2sin!4v1776674114370!5m2!1sen!2sin"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[140px] rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-2">
          <p>&copy; {new Date().getFullYear()} {t('rights')}</p>
          <span>{t('designed')}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
