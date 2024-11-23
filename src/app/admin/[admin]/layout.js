'use client'; // Ensure this is a client component

import React from 'react';
import Sidebar from './sidebar/Sidebar';

const Layout = ({ children }) => {
 return (
    <>
      <Sidebar />
      <div className="pt-24 sm:pl-28 pl-6">
        {children}
      </div>
    </>
  );
};

export default Layout;
