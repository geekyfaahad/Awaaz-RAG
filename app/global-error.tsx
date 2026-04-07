"use client"

import { useEffect } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error("[Awaaz Global Error]", error)
  }, [error])

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col"
        style={{
          backgroundColor: "#030303",
          color: "#f8fafc",
          backgroundImage:
            "radial-gradient(circle at 50% -20%, rgba(239,68,68,0.1) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(99,102,241,0.05) 0%, transparent 30%)",
        }}
      >
        <div className="flex-1 flex items-center justify-center min-h-screen px-6 py-24">
          <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-600/8 blur-[140px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-lg space-y-8">
            {/* Icon */}
            <div className="relative flex items-center justify-center w-32 h-32">
              <span
                className="absolute inline-flex w-full h-full rounded-full animate-ping"
                style={{ backgroundColor: "rgba(239,68,68,0.12)", animationDuration: "2.5s" }}
              />
              <div
                className="relative z-10 flex items-center justify-center w-20 h-20 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  boxShadow: "0 0 60px rgba(239,68,68,0.15)",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-9 h-9" stroke="#ef4444" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-1">
              <p style={{ fontFamily: "var(--font-geist-mono)", color: "rgba(239,68,68,0.5)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase" }}>
                Critical Error
              </p>
              <h1
                style={{
                  fontSize: "clamp(3rem, 8vw, 5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  background: "linear-gradient(135deg, #fff 0%, #e2e8f0 40%, #f87171 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                System Meltdown
              </h1>
            </div>

            {/* Copy */}
            <div className="space-y-2">
              <p style={{ color: "#cbd5e1", fontSize: "1.125rem" }}>
                The Awaaz engine suffered a catastrophic failure.
              </p>
              <p style={{ color: "#475569", fontSize: "0.875rem" }}>
                Even our AI fact-checker couldn&apos;t predict this one.
              </p>
            </div>

            {/* Terminal block */}
            <div
              className="w-full text-left space-y-1 p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "12px",
              }}
            >
              <p style={{ color: "#475569" }}>$ awaaz --global-status</p>
              <p style={{ color: "#f59e0b" }}>› Mounting root layout...</p>
              <p style={{ color: "#ef4444", fontWeight: 600 }}>✗ GLOBAL CRASH — ROOT LAYOUT FAILED</p>
              {error.digest && (
                <p style={{ color: "#64748b" }}>› Digest: {error.digest}</p>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => unstable_retry()}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "#4f46e5",
                  color: "#fff",
                  fontWeight: 500,
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  boxShadow: "0 0 30px rgba(99,102,241,0.3)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#6366f1")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#4f46e5")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
                </svg>
                Retry
              </button>
              <a
                href="/"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.05)",
                  color: "#cbd5e1",
                  fontWeight: 500,
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, color: "#818cf8" }}>
                  <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
                </svg>
                Go Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
