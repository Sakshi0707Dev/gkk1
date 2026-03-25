import React from 'react';
import { PhoneCall, MailOpen, HeadphonesIcon } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const ExpertSupport = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-agri-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 relative overflow-hidden">
          {/* Decorative Background Icon */}
          <HeadphonesIcon className="absolute -right-6 -bottom-6 text-agri-light w-64 h-64 opacity-50 pointer-events-none" />
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('exp_title')}</h2>
            <p className="text-gray-600 mb-10 text-lg">
              {t('exp_desc')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Info */}
              <div className="flex items-center p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-agri-green/50 transition-colors group cursor-pointer">
                <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center text-agri-green mr-5 group-hover:bg-agri-green group-hover:text-white transition-colors">
                  <PhoneCall size={28} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('call_support')}</p>
                  <p className="text-xl font-bold text-gray-900">+91 92845 18038</p>
                </div>
              </div>

              {/* Email Info */}
              <div className="flex items-center p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-agri-green/50 transition-colors group cursor-pointer">
                <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center text-agri-orange mr-5 group-hover:bg-agri-orange group-hover:text-white transition-colors">
                  <MailOpen size={28} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('email_us')}</p>
                  <p className="text-xl font-bold text-gray-900 text-sm md:text-xl">ashutoshgawande.gpb@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertSupport;
