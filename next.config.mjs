/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["isans.pythonanywhere.com"], // Make sure the domain is correctly added
  },
  i18n: {
    // Specify your default locale
    defaultLocale: "en",
    // List all supported locales
    locales: ["en", "fr", "es"], // Add or remove languages as needed
  },
};

export default nextConfig;
