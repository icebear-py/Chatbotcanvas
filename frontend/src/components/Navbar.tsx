import React from 'react'
import Container from './Container'
import logo from './logo.jpg'
import { GitHubIcon, InstagramIcon, MailIcon } from './icons'

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
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
            {/* Social Media Icons - Always visible, responsive sizing */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              <a
                href="https://github.com/icebear-py"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
                title="GitHub"
              >
                <GitHubIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-slate-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
                title="Instagram"
              >
                <InstagramIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-slate-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
                title="Email"
              >
                <MailIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-slate-300 group-hover:text-white transition-colors" />
              </a>
            </div>
            
            {/* Star me button - Responsive text and sizing */}
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 lg:px-4 py-1 sm:py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <span className="text-sm sm:text-base lg:text-lg">⭐</span>
              <span className="text-xs sm:text-sm font-medium text-slate-200 hidden sm:inline">Star me</span>
            </a>
          </div>
        </Container>
      </div>
    </header>
  )
}

export default Navbar