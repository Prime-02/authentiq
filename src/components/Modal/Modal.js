// /components/Modal.js

import { X } from "lucide-react";
import React from "react";
import { ButtonOne, ButtonTwo } from "../reusables/buttons/Buttons";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  disabled,
  loading,
  clickedTitle,
  buttonValue,
  subChildren,
  customButton,
}) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4 text-customGray"
      onClick={handleOutsideClick}
    >
      <div className="card rounded-lg shadow-lg w-full max-w-md relative max-h-[90vh] flex flex-col">
        <div className="flex-shrink-0 flex justify-between items-start p-6 pb-0">
          {title && (
            <h2 onClick={clickedTitle} className="text-2xl font-semibold pr-8">
              {title}
            </h2>
          )}
          <button
            className="absolute top-4 right-4 focus:outline-none"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X />
          </button>
        </div>

        <div className="overflow-y-auto p-6 pt-0 flex-grow">
          {onSubmit ? (
            <form onSubmit={onSubmit} className="flex flex-col h-full">
              <div className="flex-grow">{children}</div>
              <div className="flex-shrink-0 pt-4">
                {customButton ? (
                  customButton
                ) : (
                  <ButtonOne
                    buttonValue={buttonValue}
                    disabled={disabled}
                    loading={loading}
                  />
                )}
                {subChildren && subChildren}
              </div>
            </form>
          ) : (
            <div>{children}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
