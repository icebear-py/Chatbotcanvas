export const CheckCircle: React.FC<IconProps> = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M8 12.5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const XCircle: React.FC<IconProps> = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
import React from 'react'
type IconProps = React.SVGProps<SVGSVGElement>

export const SparkIcon: React.FC<IconProps> = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M12 3l2.1 4.26L19 8.27l-3.5 3.41.82 4.79L12 14.77l-4.32 1.7.82-4.79L5 8.27l4.9-.99L12 3z" stroke="currentColor" />
  </svg>
)

export const PlayIcon: React.FC<IconProps> = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <polygon points="8,5 19,12 8,19" />
  </svg>
)

export const ExtractIcon: React.FC<IconProps> = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M12 3v12m0 0l-4-4m4 4l4-4M6 21h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ChatIcon: React.FC<IconProps> = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M7 8h10M7 12h7M5 19l3-3h9a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4v5a4 4 0 004 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const LinkIcon: React.FC<IconProps> = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M10 14a5 5 0 007.07 0l2.12-2.12a5 5 0 00-7.07-7.07L10.5 6.43" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 10a5 5 0 00-7.07 0L4.8 12.13a5 5 0 007.07 7.07l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const UploadIcon: React.FC<IconProps> = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const CopyIcon: React.FC<IconProps> = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="5" y="5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

export const BotIcon: React.FC<IconProps> = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M9 7V5a3 3 0 116 0v2M7 11h10a2 2 0 012 2v4a3 3 0 01-3 3H8a3 3 0 01-3-3v-4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="14" r="1" fill="currentColor"/>
    <circle cx="14" cy="14" r="1" fill="currentColor"/>
  </svg>
)

export const SendIcon: React.FC<IconProps> = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M5 12l14-8-5 8 5 8-14-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)