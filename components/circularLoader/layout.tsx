import React from 'react'

type LayoutCircularLoaderProps = {
  children: React.ReactNode
}

const LayoutCircularLoader = ({children}:LayoutCircularLoaderProps) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default LayoutCircularLoader
