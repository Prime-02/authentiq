'use client'

import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';

export default function ClientLayout({ children }) {
 
  return (
    <>
      <Navbar/>
      {children}
      <Footer/>
    </>
  );
}
