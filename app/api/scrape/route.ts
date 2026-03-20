import { NextRequest, NextResponse } from "next/server"
import { apifyClient } from "@/lib/apify"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous"
  const { success } = rateLimit(ip, { maxTokens: 3, refillRate: 1 })
  if (!success) {
    return NextResponse.json(
      { error: "Trop de requêtes." },
      { status: 429 }
    )
  }

  try {
    const { url, type } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: "Le champ 'url' est requis." },
        { status: 400 }
      )
    }

    // Use the Google Search Results Scraper (free actor)
    const actorId = type === "linkedin"
      ? "anchor/linkedin-profile-scraper"
      : "apify/google-search-scraper"

    const run = await apifyClient.actor(actorId).call({
      queries: url,
      maxResults: 10,
    })

    const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems()

    return NextResponse.json({
      success: true,
      results: items.slice(0, 10),
    })
  } catch (error) {
    console.error("Scrape error:", error)
    return NextResponse.json(
      { error: "Erreur lors du scraping. Vérifiez votre clé Apify." },
      { status: 500 }
    )
  }
}
