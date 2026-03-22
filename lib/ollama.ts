import { createOllama } from "ollama-ai-provider"

const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434"

/**
 * Ollama AI provider for use with the Vercel AI SDK.
 * Connects to a locally running Ollama instance.
 */
export const ollama = createOllama({
  baseURL: `${ollamaBaseUrl}/api`,
})

/**
 * Get the configured Ollama model.
 */
export function getOllamaModel() {
  const modelName = process.env.OLLAMA_MODEL || "kimi:k2-5"
  return ollama(modelName)
}
