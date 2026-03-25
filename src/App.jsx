import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoriesSection from './components/CategoriesSection';
import FeaturedProducts from './components/FeaturedProducts';
import ExpertSupport from './components/ExpertSupport';
import Footer from './components/Footer';

import { LanguageProvider } from './i18n/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <div className="font-sans min-h-screen bg-white text-gray-900 selection:bg-agri-green selection:text-white">
        <Header />
        
        <main>
          <HeroSection />
          <CategoriesSection />
          <FeaturedProducts />
          <ExpertSupport />
        </main>
        
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
