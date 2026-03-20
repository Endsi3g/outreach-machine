import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || "anonymous"
    
    // In reality, this would use NextAuth session directly, but x-user-id works for API
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single()
      
    if (error && error.code !== 'PGRST116') { // Ignore row not found error
      throw error
    }

    return NextResponse.json({ profile })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { companyName, industry, website, senderName, senderEmail, signature } = await request.json()

    // Using UPSERT to save onboarding data into a 'profiles' table
    const { error } = await supabase
      .from("profiles")
      .upsert({
        user_id: userId,
        company_name: companyName,
        industry,
        website,
        sender_name: senderName,
        sender_email: senderEmail,
        signature,
        updated_at: new Date().toISOString(),
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Profile save error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
