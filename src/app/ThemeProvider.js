// components/ThemeProvider.js
"use client"; // Ensure this is at the top

import { Moon, Sun } from "lucide-react";
import React, { createContext, useContext, useEffect, useState } from "react";

// Create a Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Default to 'light'
  const [mounted, setMounted] = useState(false); // Track when component is mounted

  useEffect(() => {
    // This code runs only on the client
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = prefersDark ? "dark" : "light";
    setTheme(initialTheme);
    setMounted(true); // Mark the component as mounted

    // Set the initial theme based on device preference
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []); // Empty dependency array ensures it runs only once on mount

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme); // Apply theme to document
  };

  // Don't render the button until after mount to prevent hydration errors
  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div>
        <div
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="fixed z-50 right-5 bottom-5 flex items-center cursor-pointer"
        >
          {/* Flip Switch */}
          <div
            className={`w-10 h-5 flex items-center p-1 rounded-full shadow-md transition-all ${
              theme === "light" ? "bg-gray-300" : "bg-yellow-500"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform text-customGray flex items-center justify-center transition-transform ${
                theme === "light" ? "translate-x-0" : "translate-x-4"
              }`}
            >
              {theme === "light" ? <Sun size={12} /> : <Moon size={12} />}
            </div>
          </div>
          <span
            className={`ml-3 font-semibold ${
              theme === "light" ? "text-gray-600" : "text-white"
            }`}
          >
          </span>
        </div>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
