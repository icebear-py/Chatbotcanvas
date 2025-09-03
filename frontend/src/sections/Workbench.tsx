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

const Workbench: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>('extract')

  // Extract mode state
  const [url, setUrl] = React.useState('')
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [faqs, setFaqs] = React.useState<Faq[] | null>(null)
  const [apiKey, setApiKey] = React.useState<string>('')
  const [faqsCount, setFaqsCount] = React.useState<number>(0)
  const [copied, setCopied] = React.useState(false)
  const [error, setError] = React.useState<string>('')

  // Chat mode state
  const [connectKey, setConnectKey] = React.useState<string>('')
  const [connected, setConnected] = React.useState<boolean>(false)
  const [connecting, setConnecting] = React.useState<boolean>(false)
  const [connectionFailed, setConnectionFailed] = React.useState<boolean>(false)
  const [isApiDocsOpen, setIsApiDocsOpen] = React.useState<boolean>(false)
  const [copiedEndpoint, setCopiedEndpoint] = React.useState<boolean>(false)
  const [selectedLanguage, setSelectedLanguage] = React.useState<'curl' | 'python' | 'javascript'>('curl')

  // Refs for auto-scroll
  const extractedDataRef = React.useRef<HTMLDivElement>(null)

  const onFile = (file?: File) => {
    if (file) {
      setFileName(file.name)
      setFile(file)
    }
  }

  // Auto-scroll to bottom of extracted data
  const scrollToBottom = () => {
    if (extractedDataRef.current) {
      extractedDataRef.current.scrollTop = extractedDataRef.current.scrollHeight
    }
  }

  // Show FAQ boxes one by one with auto-scroll
  const showFaqs = async (faqsToShow: Faq[]) => {
    setFaqs([])
    setFaqsCount(faqsToShow.length)
    
    for (let i = 0; i < faqsToShow.length; i++) {
      const faq = faqsToShow[i]
      
      // Add complete FAQ at once
      setFaqs(prev => [...(prev || []), faq])
      
      // Auto-scroll to show the new FAQ
      setTimeout(() => {
        scrollToBottom()
      }, 50)
      
      // Delay between FAQs
      await new Promise(resolve => setTimeout(resolve, 600))
    }
  }

  const handleExtract = async () => {
    if (!url.trim() && !file) {
      setError('Please provide either a URL or upload a file')
      return
    }

    setLoading(true)
    setFaqs(null)
    setError('')
    setApiKey('')

    try {
      const formData = new FormData()
      
      if (url.trim()) {
        formData.append('url', url.trim())
      }
      
      if (file) {
        formData.append('file', file)
      }

      console.log('Sending request to:', `${API_BASE_URL}/api/extract_faqs`)
      console.log('FormData contents:', {
        url: url.trim() || 'not provided',
        file: file?.name || 'not provided'
      })

      const response = await axios.post(
        `${API_BASE_URL}/api/extract_faqs`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      console.log('Response received:', response.data)

      if (response.data.faqs && response.data.faqs.length > 0) {
        setApiKey(response.data.api_key)
        // Map {question, answer} to {q, a}
        const mappedFaqs = response.data.faqs.map((f: any) => ({
          q: f.question,
          a: f.answer,
        }))
        await showFaqs(mappedFaqs)
      } else {
        setError(response.data.message || 'No FAQs found')
      }
    } catch (err: any) {
      console.error('Extraction error:', err)
      setError(err.response?.data?.detail || 'Failed to extract FAQs. Please try again.')
    }

    setLoading(false)
  }

  const copyKey = async () => {
    const value = apiKey || ''
    if (!value) return
    
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getCodeSnippet = (language: 'curl' | 'python' | 'javascript') => {
    const apiKey = connected ? connectKey : '<your-api-key>'
    
    switch (language) {
      case 'curl':
        return `curl -X POST "${API_BASE_URL}/api/chat" \\
  -H "Content-Type: application/json" \\
  -H "api-key: ${apiKey}" \\
  -d '{"message": "your question here"}'`

      case 'python':
        return `import requests

headers = {
    "Content-Type": "application/json",
    "api-key": "${apiKey}"
}

response = requests.post(
    "${API_BASE_URL}/api/chat",
    headers=headers,
    json={"message": "your question here"}
)

print(response.json())`

      case 'javascript':
        return `fetch("${API_BASE_URL}/api/chat", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "api-key": "${apiKey}"
    },
    body: JSON.stringify({
        message: "your question here"
    })
})
.then(response => response.json())
.then(data => console.log(data))`
    }
  }

  const copyEndpoint = async () => {
    const code = getCodeSnippet(selectedLanguage)
    try {
      await navigator.clipboard.writeText(code)
      setCopiedEndpoint(true)
      setTimeout(() => setCopiedEndpoint(false), 2000)
    } catch (err) {
      console.error('Failed to copy endpoint:', err)
    }
  }

  const connect = async () => {
    if (!connectKey.trim() || !connectKey.startsWith("cb_canvas")) return;
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

  // Format API key for display (show first 25 characters, hide the rest)
  const formatApiKey = (key: string) => {
    if (!key) return 'API key will appear here after extraction…'
    if (key.length <= 25) return key
    return key.substring(0, 25) + '....'
  }

  return (
    <section id="extract" className="py-6 sm:py-10">
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
                    <span className="text-xs text-slate-500">Supports PDF, DOC, DOCX, TXT, XLSX files</span>
                  </div>
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.xlsx"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />

                {/* Error message */}
                {error && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-900/60 text-red-400 text-xs px-3 py-2 border border-red-400/20">
                    <XCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

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
                    value={formatApiKey(apiKey)}
                    readOnly
                    className="w-full rounded-lg bg-white/5 border border-white/10 pr-12 pl-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                  <button
                    onClick={copyKey}
                    disabled={!apiKey}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-white/10 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Copy API key"
                  >
                    {copied ? (
                      <CheckCircle width={16} height={16} className="text-green-400" />
                    ) : (
                      <CopyIcon width={16} height={16} />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">Keep your API key secure. It will be used to connect your chatbot.</p>
              </div>
            </div>

            {/* Right column: Extracted Data */}
            <div className="glass rounded-2xl p-5 sm:p-6 h-[550px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-200">Extracted Data</h3>
                {faqsCount > 0 && (
                  <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full">
                    {faqsCount} FAQs
                  </span>
                )}
              </div>

              {!faqs ? (
                <div className="flex-1 grid place-items-center text-center text-slate-400">
                  <div>
                    <div className="mx-auto mb-3 grid place-items-center w-12 h-12 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-2xl">?</span>
                    </div>
                    <p className="font-semibold">No Data Yet</p>
                    <p className="text-xs text-slate-500 mt-1">Enter a URL, or upload a document to extract FAQs</p>
                  </div>
                </div>
              ) : (
                <div 
                  ref={extractedDataRef}
                  className="flex-1 space-y-4 overflow-y-auto pr-2"
                >
                  {faqs.map((f, i) => (
                    <div key={i} className="rounded-lg bg-white/5 border border-white/10 p-4">
                      <p className="font-medium text-slate-200 mb-2">
                        <span className="text-cyan-400">Q{i + 1}.</span> {f.q}
                      </p>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        <span className="text-slate-400">A:</span> {f.a}
                      </p>
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

            {/* API Documentation */}
            <div className="glass rounded-2xl p-5 sm:p-1">
              <button
                onClick={() => setIsApiDocsOpen(!isApiDocsOpen)}
                className="w-full flex items-center justify-between text-sm font-semibold text-slate-200 mb-2"
              >
                <span className="flex items-center gap-2 mt-2 ml-3">
                  <ChatIcon width={18} height={18} className="text-cyan-300" />
                  API Documentation
                </span>
                <span className={`transition-transform mr-3 ${isApiDocsOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {isApiDocsOpen && (
                <div className="space-y-4 animate-fadeIn p-4">
                  <div className="flex items-center gap-2 mb-4">
                    {(['curl', 'python', 'javascript'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          selectedLanguage === lang
                            ? 'bg-cyan-600 text-white'
                            : 'text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        {lang === 'javascript' ? 'JS' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-lg bg-black/30 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-400">
                        {selectedLanguage === 'curl' ? 'cURL Command' : 
                         selectedLanguage === 'python' ? 'Python Request' : 
                         'JavaScript Fetch'}
                      </span>
                      <button
                        onClick={copyEndpoint}
                        className="p-1.5 rounded hover:bg-white/5 text-slate-400"
                        title="Copy to clipboard"
                      >
                        {copiedEndpoint ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <CopyIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto">
                      {getCodeSnippet(selectedLanguage)}
                    </pre>
                  </div>
                  
                  <div className="text-xs text-slate-500 leading-relaxed">
                    <p>• The Chat API accepts POST requests with your message in JSON format</p>
                    <p>• Include your API key in the request headers for authentication</p>
                    <p>• The API will return streaming response based on the FAQs extracted from your content</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}

export default Workbench