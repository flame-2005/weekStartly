import React from 'react'

type LayoutPopOverProps = {
  children: React.ReactNode
}

const layoutPopOver = ({children}:LayoutPopOverProps) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default layoutPopOver
