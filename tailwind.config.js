/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customGray: '#1e293b',
        customWhite: '#F5F5F5',
        customPink: '#FFE7D6',
        customBlue: '#4A4ABF',
      },
      fontFamily: {
        montserat: ['montserat', 'sans-serif'],
        poppins: ['poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'), // Ensure this is added
  ],
};
