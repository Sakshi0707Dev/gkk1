import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

const WebsiteLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default WebsiteLayout;
