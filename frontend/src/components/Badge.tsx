import React from 'react'
import { SparkIcon } from './icons'

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-cyan-200 bg-cyan-400/10 border border-cyan-300/20">
    <SparkIcon width={14} height={14} className="-ml-0.5 text-cyan-300" />
    {children}
  </span>
)

export default Badge