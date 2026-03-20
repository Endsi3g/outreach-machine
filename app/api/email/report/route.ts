import { NextRequest, NextResponse } from "next/server"
import { resend, FROM_EMAIL } from "@/lib/resend"

export async function POST(request: NextRequest) {
  try {
    const { to, campaignName, stats } = await request.json()

    if (!to || !campaignName) {
      return NextResponse.json(
        { error: "Les champs 'to' et 'campaignName' sont requis." },
        { status: 400 }
      )
    }

    const { sent = 0, opened = 0, replied = 0 } = stats || {}
    const openRate = sent > 0 ? ((opened / sent) * 100).toFixed(1) : "0"
    const replyRate = sent > 0 ? ((replied / sent) * 100).toFixed(1) : "0"

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #18181b;">📊 Rapport de campagne</h2>
        <p><strong>Campagne :</strong> ${campaignName}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f4f4f5;">
            <td style="padding: 12px; border: 1px solid #e4e4e7;">Emails envoyés</td>
            <td style="padding: 12px; border: 1px solid #e4e4e7; font-weight: bold;">${sent}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e4e4e7;">Taux d'ouverture</td>
            <td style="padding: 12px; border: 1px solid #e4e4e7; font-weight: bold;">${openRate}%</td>
          </tr>
          <tr style="background: #f4f4f5;">
            <td style="padding: 12px; border: 1px solid #e4e4e7;">Taux de réponse</td>
            <td style="padding: 12px; border: 1px solid #e4e4e7; font-weight: bold;">${replyRate}%</td>
          </tr>
        </table>
        <p style="color: #71717a; font-size: 14px;">— Outreach Machine par Uprising Studio</p>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `📊 Rapport : ${campaignName}`,
      html,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("Report email error:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du rapport." },
      { status: 500 }
    )
  }
}
