"use client";
import { Plus } from "lucide-react";
import React from "react";

export const ButtonOne = ({
  buttonValue,
  iconValue,
  IconButton,
  Clicked,
  disabled,
  className,
}) => (
  <button
    disabled={disabled}
    onClick={Clicked}
    className={`${className} flex items-center justify-center text-sm transition-all duration-300 cursor-pointer shadow-md active:translate-y-1 ${
      IconButton
        ? "w-9 h-9 rounded-full bg-white text-[#1a1a1a] border border-white"
        : "py-2 px-4 rounded-full bg-white text-[#1a1a1a] border border-white"
    } hover:bg-[#1a1a1a] hover:text-white ${
      disabled
        ? "opacity-50 cursor-not-allowed hover:bg-[#1a1a1a] hover:text-white"
        : ""
    }`}
  >
    {
      disabled ? <Loader/> : (
        <>
        {buttonValue && <p>{buttonValue}</p>}
    {iconValue && <p className="ml-2">{iconValue}</p>}
        </>
      )
    }
  </button>
);

export const ButtonTwo = ({
  buttonValue,
  iconValue,
  IconButton,
  Clicked,
  disabled,
  className,
}) => (
  <button
    disabled={disabled}
    onClick={Clicked}
    className={`${className}  px-6 py-3 w-auto rounded-md flex items-center justify-center text-sm transition-all duration-300 cursor-pointer shadow-md active:translate-y-1 ${
      IconButton
        ? "w-9 h-9 rounded-full border border-white text-white bg-[#1a1a1a]"
        : "py-2 px-4 rounded-full border border-white text-white bg-[#1a1a1a]"
    } hover:bg-white hover:text-[#1a1a1a] ${
      disabled
        ? "opacity-50 cursor-not-allowed hover:bg-white hover:text-[#1a1a1a]"
        : ""
    }`}
  >
    {disabled ? (
      <Loader fill={`#ffffff`} smaillerSize="15px" />
    ) : (
      <>
        {buttonValue && <p>{buttonValue}</p>}
        {iconValue && <p className="ml-2">{iconValue}</p>}
      </>
    )}
  </button>
);

export const DBButtonOne = ({
  buttonValue,
  iconValue,
  IconButton,
  Clicked,
  disabled,
  className,
}) => (
  <button
    disabled={disabled}
    type="submit"
    onClick={Clicked}
    className={`${className} flex items-center justify-center text-sm transition-all duration-300 cursor-pointer shadow-md active:translate-y-1 ${
      IconButton
        ? "w-9 h-9 rounded-full bg-blue-600 text-white border border-blue-600"
        : "py-2 px-4 rounded-full bg-blue-600 text-white border border-blue-600"
    } hover:bg-[#1a1a1a] hover:text-blue-600 ${
      disabled
        ? "opacity-50 cursor-not-allowed hover:bg-blue-600 hover:text-white"
        : ""
    }`}
  >
    {
      disabled ? <Loader/> : (
        <>
        {buttonValue && <p>{buttonValue}</p>}
    {iconValue && <p className="ml-2">{iconValue}</p>}
        </>
      )
    }
  </button>
);

export const DBButtonTwo = ({
  buttonValue,
  iconValue,
  IconButton,
  Clicked,
  disabled,
  className,
}) => (
  <button
    disabled={disabled}
    onClick={Clicked}
    className={`${className} flex items-center justify-center text-sm transition-all duration-300 cursor-pointer shadow-md active:translate-y-1 ${
      IconButton
        ? "w-9 h-9 rounded-full border border-blue-600 text-blue-600 bg-[#1a1a1a]"
        : "py-2 px-4 rounded-full border border-blue-600 text-blue-600 bg-[#1a1a1a]"
    } hover:bg-blue-600 hover:text-white ${
      disabled
        ? "opacity-50 cursor-not-allowed hover:bg-[#1a1a1a] hover:text-blue-600"
        : ""
    }`}
  >
    {
      disabled ? <Loader/> : (
        <>
        {buttonValue && <p>{buttonValue}</p>}
    {iconValue && <p className="ml-2">{iconValue}</p>}
        </>
      )
    }
  </button>
);

export const Button = ({ clicked, value }) => {
  return (
    <button
      onClick={clicked}
      className="text-white flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 justify-center gap-x-1"
    >
      <span>
        <Plus />
      </span>
      {value && <span className="hidden md:flex">{value}</span>}
    </button>
  );
};

import { useRouter } from "next/router";
import { Loader } from "@/components/Loader/Loader";

export const LanguageSwitcher = () => {
  const { locale, locales, asPath } = useRouter();

  const handleChangeLanguage = (lang) => {
    // Update the language and keep the same path
    window.location.href = `/${lang}${asPath}`; // Change the URL with the selected language
  };

  return (
    <div className="language-switcher">
      {locales.map((lang) => (
        <button
          key={lang}
          onClick={() => handleChangeLanguage(lang)}
          style={{
            margin: "0 5px",
            fontWeight: lang === locale ? "bold" : "normal",
          }}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
