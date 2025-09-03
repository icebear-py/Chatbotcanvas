import React from 'react'
import Container from './Container'
import logo from './logo.jpg'

const GITHUB_REPO = 'https://github.com/icebear-py/chatbotcanvas'

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-30">
      <div className="border-b border-white/10 bg-[#0b1020]/80 backdrop-blur">
        <Container className="h-16 flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden">
              <img src={logo} alt="ChatbotCanvas Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              ChatbotCanvas
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <span className="text-lg">⭐</span>
              <span className="text-sm font-medium text-slate-200">Star me</span>
            </a>
          </div>
        </Container>
      </div>
    </header>
  )
}

export default Navbar