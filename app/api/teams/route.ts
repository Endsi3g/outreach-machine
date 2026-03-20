import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { rateLimit } from "@/lib/rate-limit"

// GET /api/teams — List teams for the current user
export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "anonymous"

  try {
    // Get all team IDs for this user
    const { data: memberships, error: memError } = await supabase
      .from("team_members")
      .select("team_id, role")
      .eq("user_id", userId)

    if (memError) throw memError

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ teams: [] })
    }

    const teamIds = memberships.map((m) => m.team_id)

    const { data: teams, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .in("id", teamIds)

    if (teamError) throw teamError

    // Enrich with role info
    const enriched = (teams || []).map((team) => ({
      ...team,
      role: memberships.find((m) => m.team_id === team.id)?.role || "member",
    }))

    return NextResponse.json({ teams: enriched })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/teams — Create a new team
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous"
  const { success } = rateLimit(ip, { maxTokens: 5, refillRate: 1 })
  if (!success) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 })
  }

  try {
    const { userId, name } = await request.json()
    if (!name) {
      return NextResponse.json({ error: "Le nom de l'équipe est requis" }, { status: 400 })
    }

    // Create team
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({ name, owner_id: userId || "anonymous" })
      .select()
      .single()

    if (teamError) throw teamError

    // Add creator as owner member
    const { error: memberError } = await supabase
      .from("team_members")
      .insert({ team_id: team.id, user_id: userId || "anonymous", role: "owner" })

    if (memberError) throw memberError

    return NextResponse.json({ team })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/teams — Delete a team (owner only)
export async function DELETE(request: NextRequest) {
  try {
    const { teamId, userId } = await request.json()

    // Verify ownership
    const { data: team } = await supabase
      .from("teams")
      .select("owner_id")
      .eq("id", teamId)
      .single()

    if (!team || team.owner_id !== userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const { error } = await supabase.from("teams").delete().eq("id", teamId)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
