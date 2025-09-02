// src/sections/Workbench.tsx
import React from 'react'
import axios from "axios";
import Container from '../components/Container'
import SegmentedControl from '../components/SegmentedControl'
import { ButtonPrimary } from '../components/Button'
import {
  ChatIcon,
  ExtractIcon,
  LinkIcon,
  UploadIcon,
  CopyIcon,
  CheckCircle,
  XCircle,
} from '../components/icons'
import ChatPanel from '../components/ChatPanel'

type Mode = 'extract' | 'chat'
type Faq = { q: string; a: string }
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const sampleFaqs: Faq[] = [
  { q: 'What is your return policy?', a: 'Returns are accepted within 30 days with proof of purchase.' },
  { q: 'Do you support PDFs and DOCX?', a: 'Yes, upload PDF, DOC, DOCX, or TXT files for extraction.' },
  { q: 'How fast is the extraction?', a: 'Most sites/documents extract in under 30 seconds.' },
]

const Workbench: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>('extract')

  // Extract mode state
  const [url, setUrl] = React.useState('')
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [faqs, setFaqs] = React.useState<Faq[] | null>(null)
  const [apiKey, setApiKey] = React.useState<string>('')

  // Chat mode state
  const [connectKey, setConnectKey] = React.useState<string>('')
  const [connected, setConnected] = React.useState<boolean>(false)
  const [connecting, setConnecting] = React.useState<boolean>(false)
  const [connectionFailed, setConnectionFailed] = React.useState<boolean>(false)

  const onFile = (file?: File) => {
    if (file) setFileName(file.name)
  }

  const handleExtract = async () => {
    setLoading(true)
    setFaqs(null)
    // simulate async extraction
    await new Promise((r) => setTimeout(r, 1200))
    setFaqs(sampleFaqs)
    setApiKey('sk_live_5d9f...example')
    setLoading(false)
  }

  const copyKey = async () => {
    const value = apiKey || ''
    if (!value) return
    await navigator.clipboard.writeText(value)
    alert('API key copied')
  }

  

const connect = async () => {
  if (!connectKey.trim()) return;
  setConnecting(true);
  setConnectionFailed(false);
  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/is_valid_api`,
      {},
      {
        headers: {
          "api-key": connectKey,
        },
      }
    );
    if (res.data.success) {
      setConnected(true);
      setConnectionFailed(false);
    } else {
      setConnected(false);
      setConnectionFailed(true);
    }
  } catch (err) {
    setConnected(false);
    setConnectionFailed(true);
  }
  setConnecting(false);
};


  return (
    <section className="py-6 sm:py-10">
      <Container>
        {/* Toggle Extract / Chat */}
        <div className="flex justify-center">
          <SegmentedControl<Mode>
            value={mode}
            onChange={setMode}
            items={[
              { value: 'extract', label: 'Extract', icon: <ExtractIcon width={18} height={18} className="text-cyan-300" /> },
              { value: 'chat', label: 'Chat', icon: <ChatIcon width={18} height={18} className="text-cyan-300" /> },
            ]}
          />
        </div>

        {/* Views */}
        {mode === 'extract' ? (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column: Data Source + API Key */}
            <div className="space-y-6">
              {/* Data Source */}
              <div className="glass rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-200">Data Source</h3>
                </div>

                {/* URL input */}
                <label className="block text-xs text-slate-400 mb-2">Website URL</label>
                <div className="relative mb-4">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <LinkIcon width={16} height={16} />
                  </span>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-lg bg-white/5 border border-white/10 pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                </div>

                {/* Upload */}
                <p className="text-xs text-slate-400 mb-2">Or Upload Document</p>
                <label
                  htmlFor="fileInput"
                  className="group grid place-items-center rounded-xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 transition h-32 cursor-pointer"
                >
                  <div className="flex flex-col items-center text-slate-400">
                    <UploadIcon width={22} height={22} className="text-cyan-300 mb-2" />
                    <span className="text-sm">{fileName ? fileName : 'Drop your file here or click to browse'}</span>
                    <span className="text-xs text-slate-500">Supports PDF, DOC, DOCX, TXT files</span>
                  </div>
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />

                {/* Action */}
                <div className="mt-4">
                  <ButtonPrimary onClick={handleExtract} disabled={loading} className={loading ? 'opacity-70' : ''}>
                    {loading ? 'Extracting…' : 'Extract FAQs'}
                  </ButtonPrimary>
                </div>
              </div>

              {/* API Key */}
              <div className="glass rounded-2xl p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-slate-200 mb-3">API Key</h3>
                <div className="relative">
                  <input
                    value={apiKey || 'API key will appear here after extraction…'}
                    readOnly
                    className="w-full rounded-lg bg-white/5 border border-white/10 pr-12 pl-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                  <button
                    onClick={copyKey}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-white/10 text-slate-200"
                    aria-label="Copy API key"
                  >
                    <CopyIcon width={16} height={16} />
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">Keep your API key secure. It will be used to connect your chatbot.</p>
              </div>
            </div>

            {/* Right column: Extracted Data */}
            <div className="glass rounded-2xl p-5 sm:p-6 min-h-[22rem]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-200">Extracted Data</h3>
              </div>

              {!faqs ? (
                <div className="h-[18rem] grid place-items-center text-center text-slate-400">
                  <div>
                    <div className="mx-auto mb-3 grid place-items-center w-12 h-12 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-2xl">?</span>
                    </div>
                    <p className="font-semibold">No Data Yet</p>
                    <p className="text-xs text-slate-500 mt-1">Enter a URL, or upload a document to extract FAQs</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {faqs.map((f, i) => (
                    <div key={i} className="rounded-lg bg-white/5 border border-white/10 p-4">
                      <p className="font-medium text-slate-200">Q{i + 1}. {f.q}</p>
                      <p className="text-sm text-slate-300 mt-1">{f.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // CHAT MODE
          <div className="mt-6 grid grid-cols-1 gap-6">
            {/* Left column: Connect to Chatbot */}
            <div className="glass rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-200">Connect to Chatbot</h3>
              </div>
              <div className="flex justify-between" >
              <div className="relative w-full mr-10">
                <input
                  value={connectKey}
                  onChange={(e) => setConnectKey(e.target.value)}
                  placeholder="Enter your API key…"
                  className="w-full mr-10 rounded-lg bg-white/5 border border-white/10 pr-24 pl-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>
              <button
                onClick={connect}
                className="right-1 top-1/2 mt-[19px] mr-3 -translate-y-1/2 rounded-md px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 transition flex items-center gap-2"
                disabled={connecting || connected}
              >
                {connecting ? (
                  <>
                    <span className="ntg"></span> Connecting...
                  </>
                ) : connected ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" /> Connected
                  </>
                ) : connectionFailed ? (
                  <>
                    Connect
                  </>
                ) : (
                  'Connect'
                )}
              </button>
              </div>

              {connected && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-900/60 text-green-400 text-xs px-3 py-2 border border-green-400/20">
                  <CheckCircle className="w-5 h-5" />
                  <span>Connected successfully!</span>
                </div>
              )}
              {connectionFailed && !connected && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-900/60 text-red-400 text-xs px-3 py-2 border border-red-400/20">
                  <XCircle className="w-5 h-5" />
                  <span>Connection failed. Please enter a valid API key.</span>
                </div>
              )}

            </div>

            {/* Right column: Chat Panel */}
            <ChatPanel apiKey={connectKey} connected={connected} />
          </div>
        )}
      </Container>
    </section>
  )
}

export default Workbench