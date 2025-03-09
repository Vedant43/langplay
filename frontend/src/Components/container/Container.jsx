import React from 'react'

export const Container = ({children, className = ''}) => {
  return (
    <div className={`max-w-7xl px-4 py-1 ${className}`}>
      {children}  
    </div>
  )
}

