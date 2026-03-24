import { tool } from "ai"
import { z } from "zod"
import { sendMessage, readMessages, replyToMessage } from "./agentmail"

const getAgentMailConfig = () => {
  const apiKey = process.env.AGENTMAIL_API_KEY
  const inboxId = process.env.AGENTMAIL_INBOX_ID
  
  if (!apiKey || !inboxId) {
    throw new Error("AGENTMAIL_API_KEY or AGENTMAIL_INBOX_ID is missing")
  }
  
  return { apiKey, inboxId }
}

export const emailTools = {
  send_intro_email: tool({
    description: "Envoie un email de prospection ou d'introduction via AgentMail.",
    parameters: z.object({
      to: z.string().email().describe("Email du destinataire"),
      subject: z.string().describe("Sujet de l'email"),
      text: z.string().describe("Contenu texte de l'email"),
    }),
    execute: async ({ to, subject, text }) => {
      try {
        const config = getAgentMailConfig()
        const result = await sendMessage(config, { to, subject, text })
        return { sent: true, messageId: result.id, to }
      } catch (error: any) {
        return { sent: false, error: error.message }
      }
    },
  }),

  read_inbox: tool({
    description: "Lit les derniers messages reçus dans la boîte de réception AgentMail.",
    parameters: z.object({
      limit: z.number().optional().default(5).describe("Nombre de messages à lire"),
    }),
    execute: async ({ limit }) => {
      try {
        const config = getAgentMailConfig()
        const messages = await readMessages(config, limit)
        return { messages }
      } catch (error: any) {
        return { error: error.message }
      }
    },
  }),

  auto_reply: tool({
    description: "Répond automatiquement à un message spécifique via AgentMail.",
    parameters: z.object({
      messageId: z.string().describe("ID du message auquel répondre"),
      text: z.string().describe("Contenu de la réponse"),
    }),
    execute: async ({ messageId, text }) => {
      try {
        const config = getAgentMailConfig()
        const result = await replyToMessage(config, { messageId, text })
        return { replied: true, messageId: result.id }
      } catch (error: any) {
        return { replied: false, error: error.message }
      }
    },
  }),
}
