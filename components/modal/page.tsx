"use client"

import React, { useState, ReactElement, useEffect } from "react"

type ModalProps = {
  trigger: ReactElement
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal: React.FC<ModalProps> = ({ trigger, children, isOpen, setIsOpen }) => {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 modal-backdrop">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md relative max-h-[90vh] overflow-y-auto">
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default Modal