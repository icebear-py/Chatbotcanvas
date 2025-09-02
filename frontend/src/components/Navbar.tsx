import React from 'react'
import Container from './Container'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#' },
  { label: 'Docs', href: '#' },
  { label: 'Support', href: '#' },
  { label: 'Login', href: '#' },
  { label: 'Sign Up', href: '#' }, // link only (no button styling)
]

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-30">
      <div className="border-b border-white/10 bg-[#0b1020]/80 backdrop-blur">
        <Container className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-grid size-7 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-500 shadow-glow" aria-hidden />
            <span className="text-lg font-semibold tracking-tight">ChatbotCanvas</span>
          </div>
          <nav className="ml-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul className="flex items-center gap-6 text-sm text-slate-300">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-white transition-colors" aria-label={l.label}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  )
}

export default Navbar