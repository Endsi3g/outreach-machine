/**
 * Kimi K-2.5 AI Client via Ollama
 * Uses local Ollama API for email generation, refinement, and chat
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434"
const KIMI_MODEL = process.env.KIMI_MODEL || "kimi-k2.5"

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface OllamaResponse {
  model: string
  message: { role: string; content: string }
  done: boolean
}

/**
 * Send a chat completion request to Ollama with the Kimi K-2.5 model
 */
export async function chatWithKimi(messages: ChatMessage[]): Promise<string> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: KIMI_MODEL,
      messages,
      stream: false,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Ollama error (${response.status}): ${errorText}`)
  }

  const data: OllamaResponse = await response.json()
  return data.message.content
}

/**
 * Generate a personalized outreach email using Kimi K-2.5
 */
export async function generateEmail(params: {
  prospectName: string
  companyName: string
  companyInfo?: string
  services?: string
  tone?: string
  customPrompt?: string
}): Promise<string> {
  const systemPrompt = `Tu es un expert en rédaction d'emails de prospection B2B pour Uprising Studio, une agence web montréalaise.
Tu rédiges des emails personnalisés, professionnels et engageants en français.
L'objectif est d'obtenir un rendez-vous ou une réponse positive du prospect.
Sois concis, direct, et montre de la valeur dès la première ligne.
${params.customPrompt ? `\nInstructions supplémentaires de l'utilisateur: ${params.customPrompt}` : ""}`

  const userPrompt = `Rédige un email de prospection pour:
- Prospect: ${params.prospectName}
- Entreprise: ${params.companyName}
${params.companyInfo ? `- Informations sur l'entreprise: ${params.companyInfo}` : ""}
${params.services ? `- Services qu'on offre: ${params.services}` : "- Services: Création web, Automatisation IA, Consulting digital"}
${params.tone ? `- Ton souhaité: ${params.tone}` : "- Ton: Professionnel mais chaleureux"}

Format l'email avec:
- Un objet accrocheur 
- Une salutation personnalisée
- Un corps structuré (3-4 paragraphes max)
- Un call-to-action clair
- Une signature professionnelle`

  return chatWithKimi([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ])
}

/**
 * Refine an existing email based on user feedback
 */
export async function refineEmail(params: {
  originalEmail: string
  feedback: string
}): Promise<string> {
  return chatWithKimi([
    {
      role: "system",
      content: "Tu es un expert en rédaction d'emails B2B. Améliore l'email selon les instructions de l'utilisateur. Retourne uniquement l'email amélioré.",
    },
    {
      role: "user",
      content: `Email original:\n\n${params.originalEmail}\n\nFeedback/Instructions:\n${params.feedback}`,
    },
  ])
}

/**
 * Conversational AI chat for email strategy
 */
export async function conversationalChat(
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `Tu es l'assistant IA d'Uprising Studio spécialisé en outreach et prospection B2B.
Tu aides l'utilisateur à:
- Créer et améliorer des emails de prospection
- Stratégiser des campagnes d'outreach
- Analyser des prospects et trouver des angles d'approche
- Planifier des séquences d'emails
Réponds toujours en français. Sois concis et actionnable.`,
    },
    ...history,
    { role: "user", content: userMessage },
  ]

  return chatWithKimi(messages)
}

/**
 * Check if Ollama is running and Kimi model is available
 */
export async function checkOllamaStatus(): Promise<{
  running: boolean
  modelAvailable: boolean
  models: string[]
}> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`)
    if (!response.ok) return { running: false, modelAvailable: false, models: [] }

    const data = await response.json()
    const models = (data.models || []).map((m: any) => m.name)
    const modelAvailable = models.some((m: string) => m.includes("kimi"))

    return { running: true, modelAvailable, models }
  } catch {
    return { running: false, modelAvailable: false, models: [] }
  }
}
