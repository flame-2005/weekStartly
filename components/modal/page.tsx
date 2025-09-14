"use client"

import React, { useState, ReactElement, useEffect } from "react"
import ReactDOM from "react-dom"


type ModalProps = {
  trigger: ReactElement
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal = ({ trigger, children, isOpen, setIsOpen }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen])

  if (!isOpen) return <>{trigger}</>

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/20"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md relative max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal