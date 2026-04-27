/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sans-242869c0.fastapicloud.dev",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  i18n: {
    // Specify your default locale
    defaultLocale: "en",
    // List all supported locales
    locales: ["en", "fr", "es"], // Add or remove languages as needed
  },
};

export default nextConfig;
