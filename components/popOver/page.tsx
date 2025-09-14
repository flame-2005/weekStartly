"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

type Option = {
  label: string
  onClick: () => void
  icon?: React.ReactNode
  variant?: "default" | "danger" | "success"
  disabled?: boolean
}

type OptionsPopOverProps = {
  trigger: React.ReactNode
  options: Option[]
  position?: "left" | "right" | "center"
  showArrow?: boolean
}

export const OptionsPopOver: React.FC<OptionsPopOverProps> = ({ 
  trigger, 
  options, 
  position = "right",
  showArrow = true 
}) => {
  const [open, setOpen] = useState(false)
  const [animating, setAnimating] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handleClose()
      }
    }
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }
    
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [open])

  const handleOpen = () => {
    setOpen(true)
    setAnimating(true)
  }

  const handleClose = () => {
    setAnimating(false)
    setTimeout(() => setOpen(false), 150) // Wait for animation to complete
  }

  const getOptionVariantStyles = (variant: Option['variant']) => {
    switch (variant) {
      case "danger":
        return "text-red-700 hover:bg-red-50 hover:text-red-800 focus:bg-red-50"
      case "success":
        return "text-green-700 hover:bg-green-50 hover:text-green-800 focus:bg-green-50"
      default:
        return "text-gray-700 hover:bg-blue-50 hover:text-blue-800 focus:bg-blue-50"
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case "left":
        return "left-0"
      case "center":
        return "left-1/2 transform -translate-x-1/2"
      default:
        return "right-0"
    }
  }

  return (
    <div className="relative inline-block text-left" ref={ref}>
      {/* Trigger */}
      <div 
        onClick={open ? handleClose : handleOpen}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            open ? handleClose() : handleOpen()
          }
        }}
      >
        {trigger}
      </div>

      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40"
          onClick={handleClose}
        />
      )}

      {/* Popover Menu */}
      {open && (
        <div
          className={`
            absolute mt-2 ${getPositionClasses()} z-[999] min-w-48
            transform transition-all duration-150 ease-out origin-top
            ${animating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
        >
          {/* Arrow */}
          {showArrow && (
            <div className={`
              absolute top-0 transform -translate-y-full
              ${position === 'left' ? 'left-4' : position === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-4'}
            `}>
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white drop-shadow-sm" />
            </div>
          )}
          
          {/* Menu Container */}
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 backdrop-blur-sm overflow-hidden">
            <div className="py-2">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!option.disabled) {
                      option.onClick()
                      handleClose()
                    }
                  }}
                  disabled={option.disabled}
                  className={`
                    group relative w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
                    ${option.disabled 
                      ? 'text-gray-400 cursor-not-allowed bg-gray-50/50' 
                      : getOptionVariantStyles(option.variant)
                    }
                  `}
                >
                  {/* Icon */}
                  {option.icon && (
                    <div className={`
                      flex-shrink-0 w-4 h-4 transition-transform duration-200
                      ${!option.disabled ? 'group-hover:scale-110' : ''}
                    `}>
                      {option.icon}
                    </div>
                  )}
                  
                  {/* Label */}
                  <span className="flex-1 text-left truncate">
                    {option.label}
                  </span>

                  {/* Hover indicator */}
                  <div className={`
                    w-1 h-6 rounded-full transition-all duration-200 opacity-0
                    ${option.variant === 'danger' 
                      ? 'bg-red-500 group-hover:opacity-100' 
                      : option.variant === 'success'
                      ? 'bg-green-500 group-hover:opacity-100'
                      : 'bg-blue-500 group-hover:opacity-100'
                    }
                    ${option.disabled ? 'group-hover:opacity-0' : ''}
                  `} />

                  {/* Ripple effect on click */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div className={`
                      absolute inset-0 transform scale-0 rounded-full opacity-0 transition-all duration-300
                      ${option.variant === 'danger' 
                        ? 'bg-red-100 group-active:scale-100 group-active:opacity-50' 
                        : option.variant === 'success'
                        ? 'bg-green-100 group-active:scale-100 group-active:opacity-50'
                        : 'bg-blue-100 group-active:scale-100 group-active:opacity-50'
                      }
                    `} />
                  </div>
                </button>
              ))}
            </div>

            {/* Decorative bottom border */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20" />
          </div>
        </div>
      )}
    </div>
  )
}