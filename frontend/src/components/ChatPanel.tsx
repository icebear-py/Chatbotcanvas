import React from 'react'
import axios from 'axios'
import ChatMessage from './ChatMessage'
import type { ChatRole } from './ChatMessage'
import { BotIcon, SendIcon } from './icons'

type Msg = { id: string; role: ChatRole; content: string }

interface ChatPanelProps {
  apiKey: string
  connected: boolean
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

const ChatPanel: React.FC<ChatPanelProps> = ({ apiKey, connected }) => {
  const [messages, setMessages] = React.useState<Msg[]>([
    {
      id: 'intro',
      role: 'assistant',
      content: "Hello! I'm your personal Chatbot. You can test your website chatbot here.",
    },
  ])
  const [input, setInput] = React.useState('')
  const [sending, setSending] = React.useState(false)

  const onSend = async () => {
    const value = input.trim()
    if (!value || sending || !connected || !apiKey) return
    setSending(true)

    const userMsg: Msg = { id: crypto.randomUUID(), role: 'user', content: value }
    setMessages((m) => [...m, userMsg])
    setInput('')

    try {
      // Make actual API call with the API key
      const response = await axios.post(
        `${API_BASE_URL}/api/chat`, // Adjust this endpoint as needed
        {
          query: value
        },
        {
          headers: {
            "api-key": apiKey,
            "Content-Type": "application/json",
          },
        }
      )

      const botMsg: Msg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.data.message || response.data.response || 'No response received',
      }
      setMessages((m) => [...m, botMsg])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMsg: Msg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }
      setMessages((m) => [...m, errorMsg])
    }

    setSending(false)
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'NumpadEnter') && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Chat header bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-white/5 border border-white/10">
            <BotIcon width={16} height={16} className="text-cyan-300" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-200">AI Assistant</p>
            <p className="text-[11px] leading-none text-slate-400 mt-0.5">
              {connected ? 'Ready to help' : 'Connect to start chatting'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-[380px] sm:h-[460px] overflow-y-auto p-3 sm:p-4 space-y-3">
        {messages.map((m) => (
          <ChatMessage key={m.id} role={m.role} content={m.content} />
        ))}
      </div>

      {/* Composer */}
      <div className="border-t border-white/10 p-2 sm:p-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={connected ? "Type your message..." : "Connect to start chatting..."}
            disabled={!connected}
            className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={onSend}
            disabled={sending || !input.trim() || !connected}
            className="grid place-items-center rounded-lg bg-cyan-500/90 hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed px-3 py-2 text-white transition"
            aria-label="Send message"
          >
            <SendIcon width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPanel