'use client'

import { ArrowDown } from "lucide-react";
import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io";

export const Search = ({category}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your search logic here
    console.log(`Searching in category: ${selectedCategory}`);
  };

  return (
    <form className="max-w-lg" onSubmit={handleSubmit}>
      <div className="flex">
        <button
          id="dropdown-button"
          className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
          type="button"
          onClick={toggleDropdown}
        >
          {selectedCategory}{" "}
         <IoMdArrowDropdown className="ml-3"/>
        </button>
        {isDropdownOpen && (
          <div
            id="dropdown"
            className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          >
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {category?.map((category) => (
                <li key={category}>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="Search..."
            required
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
           <IoMdSearch size={20}/>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};


export const SearchTwo = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your search logic here
    console.log("Search submitted");
  };

  return (
    <form className="flex items-center w-full mx-auto" onSubmit={handleSubmit}>
      <label htmlFor="simple-search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <input
          type="text"
          id="simple-search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search..."
          required
        />
      </div>
      <button
        type="submit"
        className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <IoMdSearch size={20}/>
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
};

