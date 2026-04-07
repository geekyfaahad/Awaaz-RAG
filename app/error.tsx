"use client"

import { useEffect, useState } from "react"

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    console.error("[Awaaz Error Boundary]", error)
  }, [error])

  const copyDigest = () => {
    if (error.digest) {
      navigator.clipboard.writeText(error.digest).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-[80vh] px-6 py-24">
      {/* Ambient glow blobs — red-toned for error */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-600/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-red-900/8 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg space-y-8">
        {/* Animated icon */}
        <div className="relative flex items-center justify-center w-32 h-32">
          <span className="absolute inline-flex w-full h-full rounded-full bg-error/15 animate-ping" style={{ animationDuration: "2.5s" }} />
          <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-md border border-error/20 shadow-[0_0_60px_rgba(239,68,68,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-error" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
        </div>

        {/* Error code */}
        <div className="space-y-1">
          <p className="text-xs font-mono text-error/60 uppercase tracking-[0.3em]">Error 500</p>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-white via-slate-200 to-red-400 bg-clip-text text-transparent">
            Fact Check Failed
          </h1>
        </div>

        {/* Fun copy */}
        <div className="space-y-2">
          <p className="text-slate-300 text-lg">
            Our verification engine ran into an unexpected truth.
          </p>
          <p className="text-slate-500 text-sm">
            Something crashed on our end — not yours. Our AI is reviewing the incident.
          </p>
        </div>

        {/* Error details terminal block */}
        <div className="w-full bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl p-4 text-left font-mono text-xs space-y-1">
          <p className="text-slate-600">$ awaaz engine --status</p>
          <p className="text-warning">› Initializing RAG pipeline...</p>
          <p className="text-error font-semibold">✗ RUNTIME ERROR DETECTED</p>
          {error.message && (
            <p className="text-slate-400 truncate">
              › {process.env.NODE_ENV === "development" ? error.message : "An unexpected server error occurred."}
            </p>
          )}
          {error.digest && (
            <div className="flex items-center gap-2 pt-1">
              <p className="text-slate-600 shrink-0">› Digest:</p>
              <button
                onClick={copyDigest}
                className="text-indigo-400 hover:text-indigo-300 transition-colors truncate max-w-[200px] cursor-pointer"
                title="Click to copy error digest"
              >
                {error.digest}
              </button>
              <span className={`text-[10px] transition-opacity ${copied ? "opacity-100 text-success" : "opacity-0"}`}>
                Copied!
              </span>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => unstable_retry()}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition-all active:scale-95 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
            </svg>
            Try Again
          </button>
          <a
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 font-medium px-6 py-3 rounded-xl transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
              <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
            </svg>
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
