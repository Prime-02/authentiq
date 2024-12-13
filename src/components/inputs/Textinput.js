import { Eye, EyeClosed, Image, Plus } from "lucide-react";
import React, { useState } from "react";

export const Textinput = ({ label, type, value, changed, className, labelStyle, id =`floating_label` }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const toggleShowPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="relative">
      <input
        value={value}
        // required
        type={
          type === "password" ? (passwordVisible ? "text" : "password") : type
        }
        onChange={changed}
        id={id}
        className={`${className} block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent  border-1 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={`absolute text-sm   dark:text-gray-400 duration-300 transhtmlForm -translate-y-4 scale-75 top-2 z-10 origin-[0]   px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 ${
          labelStyle ? labelStyle : `card`
        }`}
      >
        {label}
      </label>
      {type === "password" && (
        <span
          className="absolute top-2 right-5 cursor-pointer"
          onClick={toggleShowPassword}
        >
          {passwordVisible ? <Eye /> : <EyeClosed />}
        </span>
      )}
    </div>
  );
};



export const TextArea = ({
  
  label,
  value,
  changed,
  className,
  id
}) => {
 
  return (
    <div className="relative h-auto">
      <textarea
        value={value}
        onChange={changed}
        id={id}
        className={`${className} block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent  border border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 h-16 focus:outline-none focus:ring-0 focus:border-blue-600 peer rounded-lg`}
        placeholder=" "
        required
      ></textarea>
      <label
        htmlFor={id}
        className="absolute text-sm card  dark:text-gray-400 duration-300 transhtmlForm -translate-y-4 scale-75 top-2 z-10 origin-[0]   px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {label}
      </label>
    </div>
  );
};


