import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 — Signal Lost | Awaaz AI",
  description: "This page doesn't exist. But fake news does — go verify some.",
}

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[80vh] px-6 py-24">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-900/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg space-y-8">
        {/* Animated icon */}
        <div className="relative flex items-center justify-center w-32 h-32">
          {/* Pulse rings */}
          <span className="absolute inline-flex w-full h-full rounded-full bg-indigo-500/20 animate-ping" style={{ animationDuration: "2s" }} />
          <span className="absolute inline-flex w-3/4 h-3/4 rounded-full bg-indigo-500/15 animate-ping" style={{ animationDuration: "2.6s", animationDelay: "0.4s" }} />
          {/* Core badge */}
          <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_60px_rgba(99,102,241,0.25)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-indigo-400" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 20.25h.008v.008H12v-.008Z" />
            </svg>
          </div>
        </div>

        {/* Error code */}
        <div className="space-y-1">
          <p className="text-xs font-mono text-indigo-400/60 uppercase tracking-[0.3em]">Error 404</p>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
            Signal Lost
          </h1>
        </div>

        {/* Fun copy */}
        <div className="space-y-2">
          <p className="text-slate-300 text-lg">
            We searched every news source — this page doesn&apos;t exist.
          </p>
          <p className="text-slate-500 text-sm">
            Maybe it&apos;s misinformation. Time to fact-check your URL.
          </p>
        </div>

        {/* Fake "scan" terminal block */}
        <div className="w-full bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl p-4 text-left font-mono text-xs space-y-1">
          <p className="text-slate-600">$ awaaz scan --url &lt;requested-page&gt;</p>
          <p className="text-indigo-400">› Scanning global news index...</p>
          <p className="text-indigo-400">› Cross-referencing 1,200+ sources...</p>
          <p className="text-error font-semibold">✗ VERDICT: PAGE NOT FOUND</p>
          <p className="text-slate-600">› Confidence: 100% · Sources: 0</p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition-all active:scale-95 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
            </svg>
            Back to Awaaz AI
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 font-medium px-6 py-3 rounded-xl transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
            </svg>
            Verify a Claim
          </Link>
        </div>
      </div>
    </div>
  )
}
