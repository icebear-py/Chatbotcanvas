import React from 'react'
import Container from '../components/Container'
import Badge from '../components/Badge'
import { ButtonPrimary, ButtonGhost } from '../components/Button'
import { PlayIcon } from '../components/icons'

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" />
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-center">
            <Badge>AI‑Powered Chatbot Creation</Badge>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="gradient-title">ChatbotCanvas</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed">
            Transform any URL or document into intelligent chatbots. Extract FAQs, generate API key,
            and deploy your personal conversational AI in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <ButtonPrimary onClick={() => document.getElementById('extract')?.scrollIntoView()}>Get Started Free</ButtonPrimary>
            <ButtonGhost><PlayIcon width={16} height={16} className="-ml-1 mr-2" /> Watch Demo</ButtonGhost>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero