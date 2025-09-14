"use client";

import React, { useState, ReactElement } from "react";

type ModalProps = {
  trigger: ReactElement;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal: React.FC<ModalProps> = ({ trigger, children, isOpen, setIsOpen }) => {
  return (
    <>
      {trigger}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          {/* Scrollable container for small screens */}
          <div
            className="rounded-2xl shadow-xl w-[90%] max-w-md bg-white max-h-[90vh] overflow-y-auto p-6 relative"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
