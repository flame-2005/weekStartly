"use client"

import React, { useState, ReactElement, useEffect } from "react"

type ModalProps = {
  trigger: ReactElement
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const Modal: React.FC<ModalProps> = ({ trigger, children, isOpen, setIsOpen }) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      // Store the current viewport height
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      
      // Update on resize (keyboard open/close)
      const updateVH = () => {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
      }
      
      window.addEventListener('resize', updateVH)
      return () => {
        document.body.style.overflow = 'unset'
        window.removeEventListener('resize', updateVH)
      }
    }
  }, [isOpen])

  return (
    <>
      {trigger}

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 model-backdrop"
          style={{ 
            height: '100vh',
            minHeight: '100vh',
          }}
        >
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center"
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