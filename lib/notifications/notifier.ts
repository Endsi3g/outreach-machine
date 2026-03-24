import { resend, FROM_EMAIL } from "@/lib/resend"
import { sendTelegramNotification } from "./telegram"

interface NotificationPayload {
  title: string
  message: string
  emailTo?: string
  data?: any
}

/**
 * Centralized notifier for Lead Research alerts
 * Sends both Email and Telegram notifications
 */
export async function notifyLeadResearch(payload: NotificationPayload) {
  const { title, message, emailTo, data } = payload

  // 1. Send Telegram Notification
  const telegramMessage = `🚀 <b>${title}</b>\n\n${message}\n\n${data ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : ""}`
  const telegramStatus = await sendTelegramNotification(telegramMessage)

  // 2. Send Email Notification (if email recipient provided)
  let emailStatus = false
  if (emailTo) {
    try {
      const { error } = await resend.emails.send({
        from: `Outreach Machine <${FROM_EMAIL}>`,
        to: [emailTo],
        subject: `[Lead Alert] ${title}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h1 style="color: #2563eb;">${title}</h1>
            <p style="font-size: 16px; line-height: 1.5;">${message.replace(/\n/g, '<br>')}</p>
            ${data ? `
              <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <h3 style="margin-top: 0;">Lead Details</h3>
                <pre style="white-space: pre-wrap;">${JSON.stringify(data, null, 2)}</pre>
              </div>
            ` : ""}
            <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 30px 0;" />
            <p style="font-size: 12px; color: #71717a;">Généré par Outreach Machine Agentic Research</p>
          </div>
        `,
      })
      
      if (error) {
        console.error("Resend error:", error)
      } else {
        emailStatus = true
      }
    } catch (error) {
      console.error("Failed to send email notification:", error)
    }
  }

  return { telegramStatus, emailStatus }
}
