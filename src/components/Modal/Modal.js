// /components/Modal.js

import { X } from 'lucide-react';
import React from 'react';
import { ButtonOne, ButtonTwo } from '../reusables/buttons/Buttons';

const Modal = ({ isOpen, onClose, title, children, onSubmit, disabled, loading, buttonValue, subChildren, customButton }) => {
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
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X />
        </button>
        {title && (
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">{title}</h2>
        )}
        {onSubmit ? (
          <form onSubmit={onSubmit} className="flex flex-col gap-y-3">
            <div>{children}</div>
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
          </form>
        ) : (
          <div>{children}</div> // Corrected this line to properly render children
        )}
      </div>
    </div>
  );
};

export default Modal;
