import { NextRequest, NextResponse } from "next/server"
import { resend, FROM_EMAIL } from "@/lib/resend"
import { rateLimit } from "@/lib/rate-limit"
import { auth } from "@/auth"
import { sendGmailMessage } from "@/lib/google"

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous"
  const { success: isRateLimited } = rateLimit(ip, { maxTokens: 5, refillRate: 1 })
  
  if (!isRateLimited) {
    return NextResponse.json(
      { error: "Trop de requêtes." },
      { status: 429 }
    )
  }

  try {
    const session = await auth()
    const { to, subject, body, provider = "auto" } = await request.json()

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "Les champs 'to', 'subject' et 'body' sont requis." },
        { status: 400 }
      )
    }

    // Determine which provider to use
    // If provider is 'gmail' and we have an access token, use Gmail
    // @ts-ignore
    const accessToken = session?.accessToken
    
    if ((provider === "gmail" || provider === "auto") && accessToken) {
      try {
        console.log(`📨 Tentative d'envoi via Gmail pour ${to}`)
        const result = await sendGmailMessage(accessToken, to, subject, body)
        return NextResponse.json({ success: true, id: result.id, provider: "gmail" })
      } catch (gmailError: any) {
        console.error("Gmail send error, falling back to Resend:", gmailError)
        // If Gmail fails and provider was 'gmail', return error
        if (provider === "gmail") {
          return NextResponse.json({ error: `Erreur Gmail: ${gmailError.message}` }, { status: 500 })
        }
        // Otherwise, continue to Resend fallback
      }
    }

    // Default to Resend
    console.log(`📨 Envoi via Resend pour ${to}`)
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html: `<div style="font-family: sans-serif; line-height: 1.6; color: #1a1a1a;">${body.replace(/\n/g, "<br/>")}</div>`,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id, provider: "resend" })
  } catch (error: any) {
    console.error("Email send error:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email." },
      { status: 500 }
    )
  }
}
