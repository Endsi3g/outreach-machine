/**
 * Telegram Notification Service
 * Sends alerts to a Telegram bot via its API
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

/**
 * Send a message to the configured Telegram chat
 */
export async function sendTelegramNotification(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("⚠️ Telegram configuration missing (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID)")
    return false
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Telegram API error: ${response.status} ${errorText}`)
      return false
    }

    return true
  } catch (error) {
    console.error("Failed to send Telegram notification:", error)
    return false
  }
}
