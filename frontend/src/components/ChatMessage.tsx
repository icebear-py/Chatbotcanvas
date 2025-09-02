import React from 'react'

export type ChatRole = 'user' | 'assistant'

type Props = {
  role: ChatRole
  content: string
}

const ChatMessage: React.FC<Props> = ({ role, content }) => {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[88%] sm:max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed
        ${isUser ? 'bg-cyan-500/15 border border-cyan-400/20 text-slate-100' : 'bg-white/5 border border-white/10 text-slate-100'}
      `}
      >
        {content}
      </div>
    </div>
  )
}

export default ChatMessage