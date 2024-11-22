import React from 'react';
import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16">
      <div className="md:w-[80%] w-full px-5 md:px-0 mx-auto flex flex-wrap justify-between">
        <div className=''>
          {/* Title Section */}
          <div className="w-full sm:w-1/3 mb-8 sm:mb-0">
            <h2 className="text-2xl font-semibold">iSANS ORIGINALS</h2>
            <p className="text-lg text-gray-400">Quality craftsmanship meets innovative design. Explore our exclusive collection.</p>
          </div>
        </div>

        <div className='flex justify-between w-1/3'>
          {/* Social Media Links */}
          <div className="w-full sm:w-1/4 mb-8 sm:mb-0">
            <h3 className="text-xl font-semibold">Connect with Us</h3>
            <ul className="list-none space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white flex items-center space-x-2">
                  <FaInstagram />
                  <span>Instagram</span>
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white flex items-center space-x-2">
                  <FaFacebookF />
                  <span>Facebook</span>
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white flex items-center space-x-2">
                  <FaTwitter />
                  <span>X</span>
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white flex items-center space-x-2">
                  <FaWhatsapp />
                  <span>Whatsapp</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="w-full sm:w-1/4 mb-8 sm:mb-0">
            <h3 className="text-xl font-semibold">Legal</h3>
            <ul className="list-none space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Terms of services
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center pt-6 text-sm border-t py-5 w-[80%] mx-auto border-gray-500 text-gray-400">
        <p>&copy; 2024 iSANS ORIGINALS. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
