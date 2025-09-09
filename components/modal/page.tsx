"use client"

import React, { useState, ReactElement } from "react"

type ModalProps = {
  trigger: ReactElement
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal: React.FC<ModalProps> = ({ trigger, children,isOpen,setIsOpen }) => {

  return (
    <>
      {trigger}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative">
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
  )
}

export default Modal
