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
      "(prefers-color-scheme: dark)",
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
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          className="fixed z-50 right-5 bottom-5 flex items-center gap-3 group cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleTheme();
            }
          }}
        >
          {/* Tooltip */}
          <span
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium px-2 py-1 rounded-md"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </span>

          {/* Flip Switch */}
          <div
            className="w-14 h-7 flex items-center p-1 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
            style={{
              backgroundColor:
                theme === "light" ? "var(--bg-tertiary)" : "var(--primary-900)",
              border: `2px solid ${theme === "light" ? "var(--border-color)" : "var(--primary-500)"}`,
              boxShadow:
                theme === "light"
                  ? "0 2px 4px rgba(0, 0, 0, 0.1)"
                  : "0 2px 8px rgba(115, 115, 115, 0.3)",
            }}
          >
            <div
              className="w-5 h-5 rounded-full shadow-md transform flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor:
                  theme === "light"
                    ? "var(--bg-primary)"
                    : "var(--warning-400)",
                color:
                  theme === "light"
                    ? "var(--text-secondary)"
                    : "var(--text-inverse)",
                transform:
                  theme === "light" ? "translateX(2px)" : "translateX(26px)",
                boxShadow:
                  theme === "light"
                    ? "0 1px 3px rgba(0, 0, 0, 0.2)"
                    : "0 1px 4px rgba(251, 191, 36, 0.4)",
              }}
            >
              {theme === "light" ? (
                <Sun size={14} strokeWidth={2.5} />
              ) : (
                <Moon size={14} strokeWidth={2.5} />
              )}
            </div>
          </div>
        </div>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
