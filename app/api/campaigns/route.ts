import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { rateLimit } from "@/lib/rate-limit"

// GET /api/campaigns — List all campaigns for current user
export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "anonymous"

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ campaigns: data || [] })
}

// POST /api/campaigns — Create a new campaign
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous"
  const { success } = rateLimit(ip, { maxTokens: 10, refillRate: 1 })
  if (!success) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 })
  }

  try {
    const { userId, name, subject, template } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Le nom est requis" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        user_id: userId || "anonymous",
        name,
        subject,
        template,
        status: "draft",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ campaign: data })
  } catch (error) {
    console.error("Create campaign error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la campagne." },
      { status: 500 }
    )
  }
}

// PATCH /api/campaigns — Update campaign status
export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID et statut requis" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("campaigns")
      .update({ status })
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update campaign error:", error)
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 })
  }
}

// DELETE /api/campaigns — Delete a campaign
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 })
    }

    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete campaign error:", error)
    return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 })
  }
}
