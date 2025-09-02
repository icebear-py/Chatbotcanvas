import React from 'react'
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }

export const ButtonPrimary: React.FC<ButtonProps> = ({ className = '', children, ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-500 hover:to-sky-600 shadow-glow transition ${className}`}
    {...props}
  >
    {children}
  </button>
)

export const ButtonGhost: React.FC<ButtonProps> = ({ className = '', children, ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-slate-200 border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 transition ${className}`}
    {...props}
  >
    {children}
  </button>
)