import { Eye, EyeClosed, Plus } from "lucide-react";
import React, { useState } from "react";

export const Textinput = ({ label, type, value, changed, className, placeholder }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const toggleShowPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="relative">
      <input
        value={value}
        required
        type={
          type === "password" ? (passwordVisible ? "text" : "password") : type
        }
        onChange={changed}
        id="floating_outlined"
        className={`${className} block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent  border-1 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
        placeholder=" "
      />
      <label
        htmlFor="floating_outlined"
        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {label}
      </label>
      {type === "password" && (
        <span
          className="absolute text-customGray top-2 right-5 cursor-pointer"
          onClick={toggleShowPassword}
        >
          {passwordVisible ? <Eye /> : <EyeClosed />}
        </span>
      )}
    </div>
  );
};

export const FileInput = ({ accept, changed }) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Label for Input */}
      <label
        className="block text-sm font-medium  w-full"
        htmlFor="file_input"
      >
      </label>

      {/* Hidden Native File Input */}
      <input
        id="file_input"
        type="file"
        accept={accept}
        onChange={changed}
        className="hidden"
      />

      {/* Custom Styled Label */}
      <label
        htmlFor="file_input"
        className=" w-full text-sm text-white bg-blue-500 border border-blue-500 rounded-lg cursor-pointer px-4 py-2 text-center hover:bg-blue-600 dark:bg-blue-700 dark:border-blue-700 dark:hover:bg-blue-800 flex items-center gap-x-1"
      >
        <span>
          <Plus/>
        </span>
        <span>Choose Image</span>
      </label>
    </div>
  );
};


export const TextArea = ({
  label,
  value,
  changed,
  className,
}) => {
 
  return (
    <div className="relative h-auto">
      <textarea
        value={value}
        onChange={changed}
        id="floating_outlined"
        className={`${className} block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent  border border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 h-16 focus:outline-none focus:ring-0 focus:border-blue-600 peer rounded-lg`}
        placeholder=" "
        required
      ></textarea>
      <label
        htmlFor="floating_outlined"
        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {label}
      </label>
    </div>
  );
};


export const CheckBoxList = ({ items = [], onChange }) => {
  return (
    <div>
      <h3 className="mb-4 font-semibold text-">
        Select available variants
      </h3>
      <ul className="items-center w-full text-sm font-medium bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 ">
        {items.map((item, index) => (
          <li
            key={item.id || index}
            className={`w-full ${
              index < items.length - 1
                ? "border-b sm:border-b-0 sm:border-r"
                : ""
            } border-gray-200 dark:border-gray-600`}
          >
            <div className="flex items-center ps-3">
              <input
                id={`${item.id || `checkbox-${index}`}`}
                type="checkbox"
                value={item.value}
                checked={item.checked}
                onChange={() => onChange(item)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              />
              <label
                htmlFor={`${item.id || `checkbox-${index}`}`}
                className="w-full py-3 ms-2 text-sm font-medium"
              >
                {item.label}
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
