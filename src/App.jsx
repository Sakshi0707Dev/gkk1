import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TrustSection from './components/TrustSection';
import CategoriesSection from './components/CategoriesSection';
import FeaturedProducts from './components/FeaturedProducts';
import ExpertSupport from './components/ExpertSupport';
import AboutUs from './components/AboutUs';
import ShippingPolicy from './components/ShippingPolicy';
import Gallery from './components/Gallery';
import Weather from './components/Weather';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import GovernmentSchemes from './components/GovernmentSchemes';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="font-sans min-h-screen bg-white text-gray-900 selection:bg-agri-green selection:text-white">
            <Header />
            
            <main>
              <Routes>
                <Route path="/" element={
                  <>
                    <HeroSection />
                    <TrustSection />
                    <CategoriesSection />
                    <FeaturedProducts />
                    <ExpertSupport />
                  </>
                } />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/schemes" element={<GovernmentSchemes />} />
                <Route path="/tips" element={<BlogList />} />
              </Routes>
            </main>
            
            <Footer />
            
            <WhatsAppButton />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;