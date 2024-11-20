'use client';

import React, { useState } from 'react';
import { IoMdCart } from 'react-icons/io';
import { Menu, ShoppingBag, User, X } from 'lucide-react';
import { ButtonOne } from '../reusables/buttons/Buttons';
import { Search, SearchTwo } from '../inputs/SearchInputs';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cat = [
    'All Categories',
    `T's`,
    `Beanies`
  ]

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <nav className="w-full fixed top-0 flex items-center justify-center py-4 backdrop-blur-md border-b z-50 ">
        <div className="flex w-full px-5 items-center justify-between mx-auto sm:w-[80%]">
          {/* Left Section */}
          <div className="flex flex-row gap-x-6 md:gap-x-14 items-center">
            <span className="text-lg font-bold">Logo</span>
            <div className="hidden md:flex flex-row gap-x-6">
              <span className="cursor-pointer">All</span>
              <span className="cursor-pointer">T's</span>
              <span className="cursor-pointer">Beanies</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex flex-row gap-x-8 items-center">
            <span><SearchTwo/></span>
            <User className="cursor-pointer" />
            <ShoppingBag className="cursor-pointer" />
          </div>

          {/* Mobile Dropdown Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleDropdown}
              className="text-xl focus:outline-none"
            >
              {
                !isDropdownOpen ? <Menu/>: <X/>
              }
            </button>
          </div>
        </div>

        {/* Dropdown Menu for Mobile */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-full  border-t shadow-lg md:hidden">
            <div className="flex flex-col px-5 py-4">
              <span className="cursor-pointer py-2"><Search category={cat}/></span>
              <hr className="my-2" />
              <span className="cursor-pointer py-2 flex items-center gap-x-2">
                <User /> Profile
              </span>
              <span className="cursor-pointer py-2 flex items-center gap-x-2">
                <ShoppingBag /> Cart
              </span>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
