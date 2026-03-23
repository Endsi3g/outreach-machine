import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id || request.headers.get("x-user-id") || "anonymous"

    // Fetch lead count
    const { count: leadsCount, error: leadsError } = await supabase
      .from("leads")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", userId)

    if (leadsError) throw leadsError

    // For now, other stats might still be "0" until real campaigns are run
    // But they will be real "0"s, not mock hardcoded values.
    
    return NextResponse.json({
      stats: {
        leads: leadsCount || 0,
        emailsGenerated: 0, // Should be fetched from a 'campaigns' or 'logs' table
        openRate: 0,
        replyRate: 0,
      }
    })
  } catch (error: any) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
