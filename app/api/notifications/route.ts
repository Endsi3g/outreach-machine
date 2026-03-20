import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET /api/notifications — List notifications for current user
export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "anonymous"

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ notifications: data || [] })
}

// POST /api/notifications — Create a notification
export async function POST(request: NextRequest) {
  try {
    const { userId, title, message, type } = await request.json()

    const { data, error } = await supabase
      .from("notifications")
      .insert({ user_id: userId, title, message, type: type || "info" })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ notification: data })
  } catch (error) {
    console.error("Create notification error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la notification." },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications — Mark notification(s) as read
export async function PATCH(request: NextRequest) {
  try {
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: "Le champ 'ids' (array) est requis." },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .in("id", ids)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Mark read error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour." },
      { status: 500 }
    )
  }
}
