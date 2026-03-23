import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { rateLimit } from "@/lib/rate-limit"
import { auth } from "@/auth"

// GET /api/leads — List all leads for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id || request.headers.get("x-user-id") || "anonymous"

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      // Table may not exist — return empty array gracefully
      console.error("Leads fetch error:", error.message)
      return NextResponse.json({ leads: [] })
    }

    return NextResponse.json({ leads: data || [] })
  } catch (error: any) {
    console.error("Leads API error:", error)
    return NextResponse.json({ leads: [] })
  }
}

// POST /api/leads — Create a new lead
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous"
  const { success } = rateLimit(ip, { maxTokens: 20, refillRate: 2 })
  if (!success) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 })
  }

  try {
    const body = await request.json()
    const session = await auth()
    const { name, email, company, position, website, linkedinUrl, phone, tags } = body
    const finalUserId = session?.user?.id || body.userId || "anonymous"

    const { data, error } = await supabase
      .from("leads")
      .insert({
        user_id: finalUserId,
        name, email, company, position,
        website, linkedin_url: linkedinUrl, phone,
        tags: tags || [],
        status: "new",
        score: 0,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ lead: data })
  } catch (error) {
    console.error("Create lead error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création du lead." },
      { status: 500 }
    )
  }
}

// DELETE /api/leads — Delete a lead by ID
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Le champ 'id' est requis." }, { status: 400 })
    }

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete lead error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression." },
      { status: 500 }
    )
  }
}
