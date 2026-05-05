import React from 'react';
import { HeadphonesIcon } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { useLanguage } from '../i18n/LanguageContext';

const ExpertSupport = () => {
  const { t } = useLanguage();

  return (
    <section className="py-8 sm:py-12 bg-agri-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-12 relative overflow-hidden">
          {/* Decorative Background Icon */}
          <HeadphonesIcon className="absolute -right-6 -bottom-6 text-agri-light w-32 h-32 md:w-64 md:h-64 opacity-50 pointer-events-none" />

          <div className="relative z-10 text-center max-w-xl sm:max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">{t('exp_title')}</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto">
              {t('exp_desc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp Support Info */}
              <a
                href="https://wa.me/919284518038"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#25D366]/50 transition-all hover:bg-white hover:shadow-md group cursor-pointer no-underline h-full"
              >
                <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors flex-shrink-0">
                  <FaWhatsapp size={24} />
                </div>
                <div className="text-left min-w-0 flex flex-col justify-center">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold mb-0.5">{t('call_support')}</p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap">+91 92845 18038</p>
                </div>
              </a>

              {/* Gmail Info */}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=gawandekrushikendra@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#EA4335]/50 transition-all hover:bg-white hover:shadow-md group cursor-pointer no-underline h-full"
              >
                <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center text-[#EA4335] group-hover:bg-[#EA4335] group-hover:text-white transition-colors flex-shrink-0">
                  <SiGmail size={20} />
                </div>
                <div className="text-left min-w-0 flex flex-col justify-center overflow-hidden">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold mb-0.5">{t('email_us')}</p>
                  <p className="text-[11px] sm:text-sm font-bold text-gray-900 truncate" title="gawandekrushikendra@gmail.com">
                    gawandekrushikendra@gmail.com
                  </p>
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
