import { ArrowDown } from "lucide-react";
import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io";
import { Textinput } from "./Textinput";

export const Search = ({ category }) => {
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
          className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 border border-gray-300 rounded-s-lg  focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
          type="button"
          onClick={toggleDropdown}
        >
          {selectedCategory} <IoMdArrowDropdown className="ml-3" />
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
                    className="inline-flex w-full px-4 py-2 bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
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
            className="block p-2.5 w-full z-20 text-sm  rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-transparent  dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="Search..."
            required
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white  rounded-e-lg border border-blue-700  focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <IoMdSearch size={20} />
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export const SearchTwo = ({ handleSubmit, searchTwo, onChange }) => {
  return (
    <form className="flex items-center w-full mx-auto relative" onSubmit={handleSubmit}>
      <div className="relative w-full">
       <Textinput
       labelStyle={`bg-transparent`}
       label={`Search`}
       value={searchTwo}
       changed={onChange}
       className={`border-b`}
       />
      </div>
      <button
        type="submit"
        className="p-2.5 ms-2 text-sm font-medium absolute right-0"
      >
        <IoMdSearch size={20} />
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
};
