'use client';
import React from 'react';

export const ButtonOne = ({ buttonValue, iconValue, IconButton, Clicked, disabled }) => (
  <button
    disabled={disabled}
    onClick={Clicked}
    className={`flex items-center justify-center text-sm transition-all duration-300 cursor-pointer shadow-md active:translate-y-1 ${
      IconButton
        ? 'w-9 h-9 rounded-full bg-white text-[#1a1a1a] border border-white'
        : 'py-2 px-4 rounded-full bg-white text-[#1a1a1a] border border-white'
    } hover:bg-[#1a1a1a] hover:text-white ${
      disabled ? 'opacity-50 cursor-not-allowed hover:bg-[#1a1a1a] hover:text-white' : ''
    }`}
  >
    {buttonValue && <span>{buttonValue}</span>}
    {iconValue && <span className="ml-2">{iconValue}</span>}
  </button>
);

export const ButtonTwo = ({ buttonValue, iconValue, IconButton, Clicked, disabled }) => (
  <button
    disabled={disabled}
    onClick={Clicked}
    className={`flex items-center justify-center text-sm transition-all duration-300 cursor-pointer shadow-md active:translate-y-1 ${
      IconButton
        ? 'w-9 h-9 rounded-full border border-white text-white bg-[#1a1a1a]'
        : 'py-2 px-4 rounded-full border border-white text-white bg-[#1a1a1a]'
    } hover:bg-white hover:text-[#1a1a1a] ${
      disabled ? 'opacity-50 cursor-not-allowed hover:bg-white hover:text-[#1a1a1a]' : ''
    }`}
  >
    {buttonValue && <p>{buttonValue}</p>}
    {iconValue && <p className="ml-2">{iconValue}</p>}
  </button>
);

export const DBButtonOne = ({ buttonValue, iconValue, IconButton, Clicked, disabled }) => (
  <button
    disabled={disabled}
    type="submit"
    onClick={Clicked}
    className={`flex items-center justify-center text-sm transition-all duration-300 cursor-pointer shadow-md active:translate-y-1 ${
      IconButton
        ? 'w-9 h-9 rounded-full bg-blue-600 text-white border border-blue-600'
        : 'py-2 px-4 rounded-full bg-blue-600 text-white border border-blue-600'
    } hover:bg-[#1a1a1a] hover:text-blue-600 ${
      disabled ? 'opacity-50 cursor-not-allowed hover:bg-blue-600 hover:text-white' : ''
    }`}
  >
    {buttonValue && <span>{buttonValue}</span>}
    {iconValue && <span className="ml-2">{iconValue}</span>}
  </button>
);

export const DBButtonTwo = ({ buttonValue, iconValue, IconButton, Clicked, disabled }) => (
  <button
    disabled={disabled}
    onClick={Clicked}
    className={`flex items-center justify-center text-sm transition-all duration-300 cursor-pointer shadow-md active:translate-y-1 ${
      IconButton
        ? 'w-9 h-9 rounded-full border border-blue-600 text-blue-600 bg-[#1a1a1a]'
        : 'py-2 px-4 rounded-full border border-blue-600 text-blue-600 bg-[#1a1a1a]'
    } hover:bg-blue-600 hover:text-white ${
      disabled ? 'opacity-50 cursor-not-allowed hover:bg-[#1a1a1a] hover:text-blue-600' : ''
    }`}
  >
    {buttonValue && <span>{buttonValue}</span>}
    {iconValue && <span className="ml-2">{iconValue}</span>}
  </button>
);

export const Button = ({ clicked, value }) => {
  return (
    <button
      onClick={clicked}
      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      <svg
        className="me-1 -ms-1 w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
          clipRule="evenodd"
        ></path>
      </svg>
      {value}
    </button>
  );
};