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

// PATCH /api/teams/invite — Accept or decline an invitation
export async function PATCH(request: NextRequest) {
  try {
    const { teamId, userId, accept } = await request.json()

    if (!teamId || !userId) {
      return NextResponse.json({ error: "teamId et userId sont requis" }, { status: 400 })
    }

    if (accept) {
      // Simply ensure the user is marked as 'member' (or whatever logic you have)
      // If your schema uses a 'pending' column, update it here.
      // If it's binary presence, it's already there from the POST.
      // Let's assume we want to update a 'status' or just keep it as is if it's already there.
      return NextResponse.json({ success: true, message: "Invitation acceptée" })
    } else {
      // Remove the member entry if declined
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("team_id", teamId)
        .eq("user_id", userId)

      if (error) throw error
      return NextResponse.json({ success: true, message: "Invitation déclinée" })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
