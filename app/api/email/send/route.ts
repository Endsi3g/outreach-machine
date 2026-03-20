import { NextRequest, NextResponse } from "next/server"
import { resend, FROM_EMAIL } from "@/lib/resend"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous"
  const { success } = rateLimit(ip, { maxTokens: 3, refillRate: 1 })
  if (!success) {
    return NextResponse.json(
      { error: "Trop de requêtes." },
      { status: 429 }
    )
  }

  try {
    const { to, subject, body } = await request.json()

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "Les champs 'to', 'subject' et 'body' sont requis." },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html: `<div style="font-family: sans-serif; line-height: 1.6;">${body.replace(/\n/g, "<br/>")}</div>`,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email." },
      { status: 500 }
    )
  }
}
