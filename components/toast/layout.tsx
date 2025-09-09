import React from 'react'

type LayoutToastProps = {
  children: React.ReactNode
}

const LayoutToast = ({children}:LayoutToastProps) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default LayoutToast
