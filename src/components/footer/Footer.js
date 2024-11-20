import React from "react";
import { FaFacebook, FaGooglePlus, FaInstagram, FaTelegram, FaTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#151414]">
      <div className="w-[80%] mx-auto">
        {/* Footer CTA */}
        <div className="pt-5 pb-5 border-b border-[#373636]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Find Us */}
            <div className="mb-8">
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-[#ff5e14] text-3xl mr-3"></i>
                <div className="cta-text">
                  <h4 className="text-white text-xl font-semibold">Find us</h4>
                  <span className="text-[#757575] text-sm">1010 Avenue, sw 54321, Chandigarh</span>
                </div>
              </div>
            </div>

            {/* Call Us */}
            <div className="mb-8">
              <div className="flex items-center">
                <i className="fas fa-phone text-[#ff5e14] text-3xl mr-3"></i>
                <div className="cta-text">
                  <h4 className="text-white text-xl font-semibold">Call us</h4>
                  <span className="text-[#757575] text-sm">9876543210 0</span>
                </div>
              </div>
            </div>

            {/* Mail Us */}
            <div className="mb-8">
              <div className="flex items-center">
                <i className="far fa-envelope-open text-[#ff5e14] text-3xl mr-3"></i>
                <div className="cta-text">
                  <h4 className="text-white text-xl font-semibold">Mail us</h4>
                  <span className="text-[#757575] text-sm">mail@info.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="pt-5 pb-5">
          <div className="flex  justify-between flex-col md:flex-row gap-12">
            {/* Footer Logo & Text */}
            <div className="mb-12">
              <div className="footer-logo mb-6">
                Logo
              </div>
              <p className="text-[#7e7e7e] text-sm leading-7 mb-6 ">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua.
              </p>
              <div className="footer-social-icon">
                <span className="text-white font-bold text-lg block mb-5">Follow us</span>
                <div className="flex space-x-4">
                  <a href="#" className="text-white text-xl">
                    <i className=" text-[#3B5998] "><FaFacebook/></i>
                  </a>
                  <a href="#" className="text-white text-xl">
                    <i className=" text-[#55ACEE] "><FaTwitter/></i>
                  </a>
                  <a href="#" className="text-white text-xl">
                    <i className=" bg-[#DD4B39] "><FaGooglePlus/></i>
                  </a>
                </div>
              </div>
            </div>


            {/* Subscribe */}
            <div className="mb-12">
              <h3 className="text-white text-xl font-semibold mb-10 relative">
                Subscribe
                <span className="absolute left-0 bottom-[-15px] w-[50px] h-[2px] bg-[#ff5e14]"></span>
              </h3>
              <p className="text-[#7e7e7e] text-sm mb-6">
                {`Don’t`} miss to subscribe to our new feeds, kindly fill the form below.
              </p>
              <form action="#" className="relative flex">
                <input
                  type="text"
                  placeholder="Email Address"
                  className="w-full py-[14px] px-7 bg-[#2E2E2E] text-white border-[#2E2E2E]"
                />
                <button className="absolute right-0 top-0 bg-[#ff5e14] p-4 border-[#ff5e14]">
                  <i className="text-white text-xl "><FaTelegram/></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#202020] py-6">
        <div className="w-[80%] mx-auto flex flex-col lg:flex-row justify-between items-center">
          <div className="text-center lg:text-left">
            <p className="text-[#878787] text-sm">
              Copyright &copy; 2024, All Right Reserved{" "}
              <a  className="text-[#ff5e14]">
                iSANS ORIGINAL
              </a>
            </p>
          </div>
          <div className="hidden lg:block">
            <ul className="flex space-x-6">
              {["Home", "Terms", "Privacy", "Policy", "Contact"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-[#878787] hover:text-[#ff5e14] text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
