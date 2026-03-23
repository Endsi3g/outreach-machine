import { NextRequest, NextResponse } from "next/server"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { rateLimit } from "@/lib/rate-limit"

// GET /api/emails — List generated emails for current user
export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ emails: [] }, { status: 200 })
  }

  try {
    const userId = request.headers.get("x-user-id") || "anonymous"

    const { data, error } = await supabase
      .from("generated_emails")
      .select(`
        *,
        leads ( name )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Emails fetch error:", error.message)
      return NextResponse.json({ emails: [] })
    }

    return NextResponse.json({ emails: data || [] })
  } catch (error: any) {
    console.error("Emails API error:", error)
    return NextResponse.json({ emails: [] })
  }
}

// POST /api/emails — Save a newly generated email
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ emails: [] }, { status: 200 })
  }
  const ip = request.headers.get("x-forwarded-for") || "anonymous"
  const { success } = rateLimit(ip, { maxTokens: 20, refillRate: 2 })
  if (!success) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 })
  }

  try {
    const { userId, campaignId, leadId, subject, body } = await request.json()

    if (!body) {
      return NextResponse.json({ error: "Le corps de l'email est requis" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("generated_emails")
      .insert({
        user_id: userId || "anonymous",
        campaign_id: campaignId || null,
        lead_id: leadId || null,
        subject,
        body,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ email: data })
  } catch (error) {
    console.error("Create email error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde de l'email." },
      { status: 500 }
    )
  }
}

// PATCH /api/emails — Update email status (approve/reject/sent)
export async function PATCH(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ emails: [] }, { status: 200 })
  }
  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: "ID et statut requis" }, { status: 400 })
    }

    const { error } = await supabase
      .from("generated_emails")
      .update({ status })
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update email error:", error)
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 })
  }
}
