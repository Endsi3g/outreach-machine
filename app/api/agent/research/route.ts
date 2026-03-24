import { NextResponse } from "next/server"
import { runLeadResearchAgent } from "@/lib/agent/lead-researcher"
import { auth } from "@/auth"

/**
 * POST /api/agent/research
 * Launch a lead research task
 */
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { target } = await req.json()
    if (!target) {
      return NextResponse.json({ error: "Missing target (email or domain)" }, { status: 400 })
    }

    // Run agent in background or await if you want immediate results
    // For now we await to show the result in the UI
    const result = await runLeadResearchAgent(target, session.user?.email || undefined)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Agent Research API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
