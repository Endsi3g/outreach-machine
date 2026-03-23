import { NextRequest, NextResponse } from "next/server"
import { researchProspect, researchMultipleProspects } from "@/lib/agent/web-scraper"
import { auth } from "@/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { url, urls } = body

    // Batch research
    if (urls && Array.isArray(urls)) {
      const results = await researchMultipleProspects(urls.slice(0, 10))
      return NextResponse.json({ results })
    }

    // Single research
    if (!url) {
      return NextResponse.json({ error: "URL requis" }, { status: 400 })
    }

    const data = await researchProspect(url)
    return NextResponse.json({ data })
  } catch (error: any) {
    console.error("Agent research error:", error)
    return NextResponse.json(
      { error: error.message || "Erreur de recherche" },
      { status: 500 }
    )
  }
}
