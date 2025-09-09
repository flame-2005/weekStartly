import React from "react"

type EventsLayoutProps = {
  children: React.ReactNode
}

export default function EventsLayout({ children }: EventsLayoutProps) {
  return (
    <div className="p-4">
      {children}
    </div>
  )
}
