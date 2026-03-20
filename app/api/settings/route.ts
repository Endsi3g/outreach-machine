import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { encrypt, decrypt } from "@/lib/crypto"

// GET /api/settings — Read user settings (decrypt keys for display)
export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "anonymous"

  try {
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    if (!data) {
      return NextResponse.json({ settings: null })
    }

    // Decrypt sensitive fields for display (masked)
    const resendKey = decrypt(data.resend_api_key_encrypted || "")
    const apifyToken = decrypt(data.apify_token_encrypted || "")

    return NextResponse.json({
      settings: {
        ollama_url: data.ollama_url || "",
        ollama_model: data.ollama_model || "",
        resend_api_key: resendKey ? `${resendKey.substring(0, 6)}${"•".repeat(Math.max(0, resendKey.length - 6))}` : "",
        apify_token: apifyToken ? `${apifyToken.substring(0, 6)}${"•".repeat(Math.max(0, apifyToken.length - 6))}` : "",
        sentry_dsn: data.sentry_dsn || "",
        has_resend_key: !!resendKey,
        has_apify_token: !!apifyToken,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/settings — Save user settings (encrypt sensitive keys)
export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "anonymous"

  try {
    const { ollamaUrl, ollamaModel, resendApiKey, apifyToken, sentryDsn } =
      await request.json()

    // Build upsert payload — only encrypt non-empty new values
    const payload: Record<string, any> = {
      user_id: userId,
      updated_at: new Date().toISOString(),
    }

    if (ollamaUrl !== undefined) payload.ollama_url = ollamaUrl
    if (ollamaModel !== undefined) payload.ollama_model = ollamaModel
    if (sentryDsn !== undefined) payload.sentry_dsn = sentryDsn

    // Only re-encrypt if the user actually typed a new key (not the masked one)
    if (resendApiKey && !resendApiKey.includes("•")) {
      payload.resend_api_key_encrypted = encrypt(resendApiKey)
    }
    if (apifyToken && !apifyToken.includes("•")) {
      payload.apify_token_encrypted = encrypt(apifyToken)
    }

    const { error } = await supabase
      .from("user_settings")
      .upsert(payload, { onConflict: "user_id" })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
