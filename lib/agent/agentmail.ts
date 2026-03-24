/**
 * AgentMail API Client
 * Simplified client for sending, reading, and replying to emails via agentmail.to
 */

export interface AgentMailConfig {
  apiKey: string
  inboxId: string
}

export interface SendEmailParams {
  to: string
  subject: string
  text: string
  html?: string
}

export interface ReplyEmailParams {
  messageId: string
  text: string
  html?: string
}

/**
 * Send an email through AgentMail
 */
export async function sendMessage(config: AgentMailConfig, params: SendEmailParams) {
  const response = await fetch("https://api.agentmail.to/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": config.apiKey,
    },
    body: JSON.stringify({
      inbox_id: config.inboxId,
      to: params.to,
      subject: params.subject,
      body_text: params.text,
      body_html: params.html,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`AgentMail send error: ${error}`)
  }

  return response.json()
}

/**
 * Read messages from the AgentMail inbox
 */
export async function readMessages(config: AgentMailConfig, limit = 10) {
  const response = await fetch(`https://api.agentmail.to/v1/inboxes/${config.inboxId}/messages?limit=${limit}`, {
    method: "GET",
    headers: {
      "X-API-Key": config.apiKey,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`AgentMail read error: ${error}`)
  }

  return response.json()
}

/**
 * Reply to a message through AgentMail
 */
export async function replyToMessage(config: AgentMailConfig, params: ReplyEmailParams) {
  const response = await fetch(`https://api.agentmail.to/v1/messages/${params.messageId}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": config.apiKey,
    },
    body: JSON.stringify({
      body_text: params.text,
      body_html: params.html,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`AgentMail reply error: ${error}`)
  }

  return response.json()
}
