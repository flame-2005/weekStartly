"use client"

import React from "react"

type CircularLoaderProps = {
  size?: number // px, default 48
  thickness?: number // px, default 4
  message?: string // optional text under spinner
}

const CircularLoader: React.FC<CircularLoaderProps> = ({
  size = 48,
  thickness = 4,
  message,
}) => {
  const spinnerStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "9999px",
    borderStyle: "solid",
    borderWidth: thickness,
    borderColor: "rgba(255,255,255,0.25)", // faint ring
    borderTopColor: "rgba(255,255,255,1)", // the animated section
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          style={spinnerStyle}
          className="animate-spin"
          aria-hidden="true"
        />
        {message && (
          <div className="text-white text-sm opacity-95 select-none">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default CircularLoader
