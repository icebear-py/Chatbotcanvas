import React from 'react'

type Props = { className?: string; children: React.ReactNode }

const Container: React.FC<Props> = ({ className = '', children }) => (
  <div className={`mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
)

export default Container