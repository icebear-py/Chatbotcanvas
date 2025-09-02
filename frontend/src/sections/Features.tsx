import React from 'react'
import Container from '../components/Container'

const features = [
  {
    title: 'Instant Extraction',
    desc: 'Extract FAQs from any website or document in seconds using advanced AI.',
    icon: '⚡',
  },
  {
    title: 'API Generation',
    desc: 'Get instant API access to your chatbot with secure key management.',
    icon: '🔑',
  },
  {
    title: 'Smart Chat Interface',
    desc: 'Beautiful, responsive chat UI with intelligent conversation flow.',
    icon: '💬',
  },
]

const Features: React.FC = () => {
  return (
    <section id="features" className="py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Powerful Features</h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Everything you need to create, deploy, and manage intelligent chatbots.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold text-slate-200">{f.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Features