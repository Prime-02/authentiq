import React from 'react';
import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import { FaXTwitter } from 'react-icons/fa6';
import { RiInstagramLine } from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16">
      <div className="md:w-[80%] w-full px-5 md:px-0 mx-auto flex flex-col sm:flex-row justify-between">
        <div className='w-full sm:w-1/3 mb-8 sm:mb-0'>
          {/* Title Section */}
          <h2 className="text-2xl sm:text-3xl font-semibold">iSANS ORIGINALS</h2>
          <p className=" text-gray-400">Quality craftsmanship meets innovative design. Explore our exclusive collection.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:w-1/3 justify-evenly w-full">
          {/* Social Media Links */}
          <div className="w-full sm:w-1/2 mb-8 sm:mb-0">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">Connect</h3>
            <ul className="list-none space-y-2 flex gap-x-4 items-center justify-start ">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  <RiInstagramLine size={20} className='mt-2' />
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  <FaFacebookF size={20} />
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  <FaXTwitter size={20} />
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  <FaWhatsapp size={20} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="w-full sm:w-1/2 mb-8 sm:mb-0">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">Legal</h3>
            <ul className="list-none space-y-2">
              <li>
                <Link href="/terms-of-services" className="text-gray-400 hover:text-white">
                  Terms of Services
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-400 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center pt-6 mt-4 text-sm sm:text-base border-t py-5 w-full sm:w-[80%] mx-auto border-gray-500 text-gray-400">
        <p>&copy; 2024 iSans Originals. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
