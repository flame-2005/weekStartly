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
  // Static styles for the default spinner
  const styles = {
    backdrop: "bg-gray-900/20",
    spinner: "border-gray-300/30 border-t-blue-500",
    text: "text-gray-700",
    glow: "shadow-blue-500/25",
  }

  const spinnerStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "9999px",
    borderStyle: "solid",
    borderWidth: thickness,
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-all duration-300 ${styles.backdrop}`}
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      {/* Loading Card */}
      <div
        className={`flex flex-col items-center justify-center bg-white rounded-2xl p-8 shadow-2xl ${styles.glow} border border-gray-100/50 backdrop-blur-sm transform transition-all duration-500 hover:scale-[1.02]`}
      >
        {/* Spinner Container */}
        <div className="relative flex items-center justify-center mb-4">
          {/* Default Spinner */}
          <div
            style={spinnerStyle}
            className={`animate-spin ${styles.spinner}`}
            aria-hidden="true"
          />

          {/* Decorative elements */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-2 h-2 rounded-full animate-pulse opacity-60 bg-blue-400"
              style={{
                animationDelay: "0s",
                transform: `translateY(-${size * 0.3}px)`,
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse opacity-40 bg-blue-300"
              style={{
                animationDelay: "0.5s",
                transform: `translateY(${size * 0.3}px)`,
              }}
            />
            <div
              className="w-1 h-1 rounded-full animate-pulse opacity-30 bg-blue-200"
              style={{
                animationDelay: "1s",
                transform: `translateX(-${size * 0.3}px)`,
              }}
            />
            <div
              className="w-1 h-1 rounded-full animate-pulse opacity-20 bg-blue-200"
              style={{
                animationDelay: "1.5s",
                transform: `translateX(${size * 0.3}px)`,
              }}
            />
          </div>
        </div>

        {/* Message Section */}
        {message && (
          <div className="flex flex-col items-center space-y-2">
            <div className={`text-center max-w-xs ${styles.text}`}>
              <p className="text-base font-medium leading-relaxed">{message}</p>

              {/* Animated dots */}
              <div className="flex items-center justify-center space-x-1 mt-2">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-bounce bg-blue-400"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full animate-bounce bg-blue-400"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full animate-bounce bg-blue-400"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.2) 2px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>
    </div>
  )
}

export default CircularLoader
