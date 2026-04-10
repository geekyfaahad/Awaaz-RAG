import { NextRequest, NextResponse } from "next/server"
import { getGoogleNews } from "@/lib/news"
import { buildEvidence } from "@/lib/rag"
import { aiReasoning } from "@/lib/ai"
import { sanitizeClaim } from "@/lib/validation"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { getCache, setCache, TTL } from "@/lib/cache"

/** Rate limit: 15 verifications per minute per IP */
const RATE_WINDOW = 60_000
const RATE_MAX = 15

export async function POST(req: NextRequest) {
  try {
    // --- Rate limiting ---
    const ip = getClientIp(req)
    const limit = checkRateLimit(ip, RATE_WINDOW, RATE_MAX)

    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait before trying again.",
          retryAfterMs: limit.resetInMs,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(limit.resetInMs / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      )
    }

    // --- Input validation ---
    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }
    const validation = sanitizeClaim(body.claim)

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const claim = validation.sanitized

    // --- Check cache ---
    const cacheKey = `verify:${claim.toLowerCase()}`
    const cached = getCache<{ result: string; sources: unknown[] }>(cacheKey)

    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
      }, {
        headers: {
          "X-RateLimit-Remaining": String(limit.remaining),
          "X-Cache": "HIT",
        },
      })
    }

    // --- Fetch evidence ---
    const articles = await getGoogleNews(claim)

    const evidence = await buildEvidence(articles)

    // --- AI reasoning with improved prompt ---
    const prompt = `You are a rigorous news fact-checking AI. Your task is to evaluate whether a claim is supported by the provided evidence from news sources.

CLAIM:
"${claim}"

EVIDENCE FROM NEWS SOURCES:
${evidence}

INSTRUCTIONS:
1. Carefully analyze each source and compare against the claim.
2. Consider source reliability and agreement between sources.
3. If sources contradict the claim, mark as FAKE.
4. If sources clearly support the claim, mark as TRUE.
5. If evidence is insufficient or unclear, mark as UNVERIFIED.
6. Be conservative — only mark TRUE when evidence is strong.

Return a JSON object with exactly these fields:
{
  "verdict": "TRUE" | "FAKE" | "UNVERIFIED",
  "reason": "A clear 2-3 sentence explanation of your reasoning",
  "confidence": <number 0-100>,
  "agreement": "Low" | "Medium" | "High"
}
`

    const result = await aiReasoning(prompt)

    // --- Cache the result ---
    const response = { result, sources: articles }
    setCache(cacheKey, response, TTL.VERIFICATION)

    return NextResponse.json(response, {
      headers: {
        "X-RateLimit-Remaining": String(limit.remaining),
        "X-Cache": "MISS",
      },
    })
  } catch (err) {
    console.error("Verify API Error:", err)

    const errMsg = err instanceof Error ? err.message : ""

    let message: string
    let status = 500

    if (errMsg.includes("No AI API key configured")) {
      message = "No AI provider is configured. Please set OPENAI_API_KEY or GEMINI_API_KEY in your .env file."
      status = 503
    } else if (errMsg.includes("timed out")) {
      message = "Verification timed out. The AI service may be under load — please try again."
      status = 504
    } else if (errMsg.includes("401") || errMsg.includes("Incorrect API key")) {
      message = "AI API key is invalid or expired. Please check your .env configuration."
      status = 502
    } else if (errMsg.includes("429") || errMsg.includes("quota")) {
      message = "AI provider rate limit or quota exceeded. Please try again later."
      status = 502
    } else if (errMsg.includes("503") || errMsg.includes("high demand") || errMsg.includes("Service Unavailable")) {
      message = "The AI service is temporarily overloaded. Please try again in a few moments."
      status = 503
    } else if (errMsg.includes("500") || errMsg.includes("Internal Server Error")) {
      message = "The AI service encountered an internal error. Please try again."
      status = 502
    } else {
      message = "Verification failed due to a server error"
    }

    return NextResponse.json(
      {
        error: message,
        details:
          process.env.NODE_ENV === "development" && err instanceof Error
            ? err.message
            : undefined,
      },
      { status }
    )
  }
}