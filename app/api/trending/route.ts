import Parser from "rss-parser"
import { aiReasoning } from "@/lib/ai"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { getCache, setCache, getCacheAge, TTL } from "@/lib/cache"

const parser = new Parser({
  timeout: 15_000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/rss+xml, application/xml, text/xml;q=0.9,*/*;q=0.8",
  },
})

function fallbackClaimsFromTitles(titles: string[]): string[] {
  return titles
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((t) => (t.length > 140 ? `${t.slice(0, 137)}...` : t))
}

/** OpenAI json_object mode requires a JSON object; Gemini may return an array. */
function parseModelClaimsJson(text: string): string[] {
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim()
  if (!cleaned) return []

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    const matches = cleaned.match(/"([^"]+)"/g)
    if (matches) {
      return matches.map((m) => m.replace(/"/g, "")).slice(0, 3)
    }
    return cleaned
      .split("\n")
      .map((l) => l.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 3)
  }

  if (Array.isArray(parsed)) {
    return parsed.map(String).filter(Boolean).slice(0, 3)
  }

  if (parsed && typeof parsed === "object") {
    const o = parsed as Record<string, unknown>
    for (const key of ["trending_claims", "claims", "items"]) {
      const arr = o[key]
      if (Array.isArray(arr)) {
        return arr.map(String).filter(Boolean).slice(0, 3)
      }
    }
  }

  return []
}

/** Rate limit: 20 requests per minute per IP */
const RATE_WINDOW = 60_000
const RATE_MAX = 20

const CACHE_KEY = "trending:claims"

export async function GET(req: Request) {
  try {
    // --- Rate limiting ---
    const ip = getClientIp(req)
    const limit = checkRateLimit(ip, RATE_WINDOW, RATE_MAX)

    if (!limit.allowed) {
      return Response.json(
        { trending_claims: [], error: "Too many requests" },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(limit.resetInMs / 1000)),
          },
        }
      )
    }

    // --- Check cache first (10-minute TTL) ---
    const cached = getCache<string[]>(CACHE_KEY)
    if (cached) {
      const age = getCacheAge(CACHE_KEY)
      return Response.json(
        { trending_claims: cached, cached: true },
        {
          headers: {
            "X-Cache": "HIT",
            "X-Cache-Age": String(age),
          },
        }
      )
    }

    // --- Fetch fresh trending headlines ---
    const url =
      "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en"

    const feed = await parser.parseURL(url)

    const titles = feed.items.slice(0, 5).map((i) => {
      const title = i.title || ""
      return title.split(" - ").slice(0, -1).join(" - ") || title
    })

    const prompt = `Rewrite these headlines as short verifiable claims (max 8 words each).

${titles.join("\n")}

Return JSON with key "trending_claims": an array of exactly 3 strings.
Example: {"trending_claims": ["Claim one", "Claim two", "Claim three"]}
`

    let claims: string[] = []

    try {
      const text = await aiReasoning(prompt)
      if (text) {
        claims = parseModelClaimsJson(text)
      }
    } catch (aiErr) {
      console.error("Trending AI step failed, using headline fallback:", aiErr)
    }

    if (claims.length === 0) {
      claims = fallbackClaimsFromTitles(titles)
    }

    const result = claims.slice(0, 3)

    // --- Cache for 10 minutes ---
    setCache(CACHE_KEY, result, TTL.TRENDING)

    return Response.json(
      { trending_claims: result, cached: false },
      {
        headers: {
          "X-Cache": "MISS",
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60",
        },
      }
    )
  } catch (err) {
    console.error("Trending API Error:", err)
    const errMsg = err instanceof Error ? err.message : ""
    const isOverloaded =
      errMsg.includes("503") ||
      errMsg.includes("high demand") ||
      errMsg.includes("Service Unavailable") ||
      errMsg.includes("Service unavailable")
    const noAi =
      errMsg.includes("No AI API key") || errMsg.includes("API key configured")
    return Response.json(
      {
        trending_claims: [],
        error: noAi
          ? "AI not configured"
          : isOverloaded
            ? "AI service temporarily overloaded"
            : "Service unavailable",
      },
      { status: noAi ? 503 : isOverloaded ? 503 : 500 }
    )
  }
}