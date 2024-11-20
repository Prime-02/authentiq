// components/ThemeProvider.js
'use client'; // Ensure this is at the top

import React, { createContext, useContext, useEffect, useState } from 'react';
import { FaMoon } from 'react-icons/fa6';
import { IoIosSunny } from 'react-icons/io';

// Create a Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default to 'light'
  const [mounted, setMounted] = useState(false); // Track when component is mounted

  useEffect(() => {
    // This code runs only on the client
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDark ? 'dark' : 'light';
    setTheme(initialTheme);
    setMounted(true); // Mark the component as mounted

    // Set the initial theme based on device preference
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []); // Empty dependency array ensures it runs only once on mount

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme); // Apply theme to document
  };

  // Don't render the button until after mount to prevent hydration errors
  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div>
        <button
          onClick={toggleTheme}
          aria-label='Toggle theme'
          className='fixed z-50 text-3xl right-5 bottom-5'
        >
          {theme === 'light' ? (
            <FaMoon className='text-neutral-600' />
          ) : (
            <IoIosSunny className='text-yellow-500' />
          )}
        </button>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
