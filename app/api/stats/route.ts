import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { auth } from "@/auth"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id || request.headers.get("x-user-id") || "anonymous"

    let leadsCount = 0

    try {
      const { count, error } = await supabase
        .from("leads")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", userId)

      if (!error && count !== null) {
        leadsCount = count
      }
    } catch {
      // Table may not exist yet — return 0
    }

    return NextResponse.json({
      stats: {
        leads: leadsCount,
        emailsGenerated: 0,
        openRate: 0,
        replyRate: 0,
      }
    })
  } catch (error: any) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({
      stats: { leads: 0, emailsGenerated: 0, openRate: 0, replyRate: 0 }
    })
  }
}
