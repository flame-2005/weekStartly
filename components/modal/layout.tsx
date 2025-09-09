import React from 'react'

type LayoutModalProps = {
  children: React.ReactNode
}

const layoutModal = ({children} : LayoutModalProps) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default layoutModal
