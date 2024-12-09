import { useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";

export const PopOver = ({
  button = `left`,
  content = `add content`,
  heading = `add header`,
  placement = "left",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current && popoverRef.current) {
      createPopper(buttonRef.current, popoverRef.current, {
        placement: placement,
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8], // Adjust the offset of the popover
            },
          },
        ],
      });
    }
  }, [placement]);

  const togglePopover = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={togglePopover}
        className=""
      >
        {button}
      </button>
      {isVisible && (
        <div
          ref={popoverRef}
          role="menu"
          className="absolute z-10 w-64 h-auto text-sm transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-600"
        >
          <div className="px-3 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600 text-slate-800">
            <div className="font-semibold">{heading}</div>
          </div>
          <div className="px-3 py-2 text-slate-800">
            <div>{content}</div>
          </div>
        </div>
      )}
    </div>
  );
};
