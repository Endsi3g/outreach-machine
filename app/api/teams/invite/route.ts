import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// POST /api/teams/invite — Invite a member to a team
export async function POST(request: NextRequest) {
  try {
    const { teamId, email, role, invitedBy } = await request.json()

    if (!teamId || !email) {
      return NextResponse.json(
        { error: "teamId et email sont requis" },
        { status: 400 }
      )
    }

    // Verify inviter is owner or admin
    const { data: membership } = await supabase
      .from("team_members")
      .select("role")
      .eq("team_id", teamId)
      .eq("user_id", invitedBy)
      .single()

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from("team_members")
      .select("user_id")
      .eq("team_id", teamId)
      .eq("user_id", email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "Cette personne est déjà membre de l'équipe" },
        { status: 409 }
      )
    }

    // Add member
    const { error } = await supabase
      .from("team_members")
      .insert({ team_id: teamId, user_id: email, role: role || "member" })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
