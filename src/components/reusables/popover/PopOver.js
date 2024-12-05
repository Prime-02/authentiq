import React from "react";
import "flowbite/dist/flowbite.css";
import "flowbite";



export const PopOverThree = () => {
  return (
    <div>
      <button
        data-popover-target="popover-bottom"
        data-popover-placement="bottom"
        type="button"
        className="text-white mb-3 me-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Bottom popover
      </button>
      <div
        data-popover
        id="popover-bottom"
        role="tooltip"
        className="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
      >
        <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Popover bottom
          </h3>
        </div>
        <div className="px-3 py-2">
          <p>And here's some amazing content. It's very engaging. Right?</p>
        </div>
        <div data-popper-arrow></div>
      </div>
    </div>
  );
};

export const PopOver = ({
  button = `left`,
  content = `add content`,
  heading = `add header`,
  placement = "left",
}) => {
  return (
    <div>
      <button
        data-popover-target={`popover_${placement}`}
        data-popover-placement={placement}
        type="button"
      >
        {button}
      </button>
      <div
        data-popover
        id={`popover_${placement}`}
        role="menu"
        className="absolute z-10 invisible inline-block w-64 h-auto text-sm  transition-opacity duration-300 card border border-gray-200 rounded-lg shadow-sm opacity-0  dark:border-gray-600 dark:bg-gray-800"
      >
        <div className="px-3 py-2 card border-b border-gray-200 rounded-t-lg dark:border-gray-600 ">
          <div className="font-semibold ">
            {heading}
          </div>
        </div>
        <div className="px-3 py-2">
          <div>
            {content}
          </div>
        </div>
        <div data-popper-arrow></div>
      </div>
    </div>
  );
};
