"use client"

import React, { useState, useRef, useEffect } from "react"

type Option = {
  label: string
  onClick: () => void
}

type OptionsPopOverProps = {
  trigger: React.ReactNode
  options: Option[]
}

export const OptionsPopOver: React.FC<OptionsPopOverProps> = ({ trigger, options }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      {open && (
        <div
          className="absolute right-0 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.onClick()
                  setOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
