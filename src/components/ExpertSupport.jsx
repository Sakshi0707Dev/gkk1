import React from 'react';
import { HeadphonesIcon } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { useLanguage } from '../i18n/LanguageContext';

const ExpertSupport = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-agri-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-12 relative overflow-hidden">
          {/* Decorative Background Icon */}
          <HeadphonesIcon className="absolute -right-6 -bottom-6 text-agri-light w-48 h-48 md:w-64 md:h-64 opacity-50 pointer-events-none" />

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">{t('exp_title')}</h2>
            <p className="text-gray-600 mb-8 md:mb-10 text-base md:text-lg max-w-2xl mx-auto">
              {t('exp_desc')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* WhatsApp Support Info */}
              <a
                href="https://wa.me/919284518038"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start p-3 md:p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#25D366]/50 transition-all hover:bg-white hover:shadow-md group cursor-pointer no-underline"
              >
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white shadow-sm rounded-full flex items-center justify-center text-[#25D366] mr-3 md:mr-5 group-hover:bg-[#25D366] group-hover:text-white transition-colors flex-shrink-0 mt-0.5 md:mt-1">
                  <FaWhatsapp size={20} className="md:w-7 md:h-7" />
                </div>
                <div className="text-left py-0.5 md:py-1">
                  <p className="text-[10px] md:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">{t('call_support')}</p>
                  <p className="text-sm md:text-xl font-bold text-gray-900">+91 92845 18038</p>
                </div>
              </a>

              {/* Gmail Info */}
              <a
                href="mailto:gawandekrushikendra@gmail.com"
                className="flex items-start p-3 md:p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#EA4335]/50 transition-all hover:bg-white hover:shadow-md group cursor-pointer no-underline"
              >
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white shadow-sm rounded-full flex items-center justify-center text-[#EA4335] mr-3 md:mr-5 group-hover:bg-[#EA4335] group-hover:text-white transition-colors flex-shrink-0 mt-0.5 md:mt-1">
                  <SiGmail size={18} className="md:w-6 md:h-6" />
                </div>
                <div className="text-left overflow-hidden py-0.5 md:py-1">
                  <p className="text-[10px] md:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">{t('email_us')}</p>
                  <p className="text-[11px] sm:text-sm md:text-lg font-bold text-gray-900 break-words leading-tight">gawandekrushikendra@gmail.com</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertSupport;
