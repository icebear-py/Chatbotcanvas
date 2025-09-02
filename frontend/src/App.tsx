import React from 'react'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Workbench from './sections/Workbench'
import Features from './sections/Features'

const App: React.FC = () => {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Workbench />
        <Features />
      </main>
      {/* Intentionally no “Made with wowdev.ai” */}
    </div>
  )
}

export default App