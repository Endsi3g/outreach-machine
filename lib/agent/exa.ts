/**
 * Exa.ai API Wrapper
 * Performs semantic search and web research
 */

const EXA_API_KEY = process.env.EXA_API_KEY

interface ExaSearchResult {
  title: string
  url: string
  score: number
  publishedDate?: string
  author?: string
  text?: string
  highlights?: string[]
}

interface ExaSearchResponse {
  results: ExaSearchResult[]
}

/**
 * Perform a semantic search via Exa.ai
 */
export async function searchExa(query: string, options: {
  numResults?: number
  useAutoprompt?: boolean
  type?: "keyword" | "neural"
  includeText?: boolean
} = {}): Promise<ExaSearchResult[]> {
  if (!EXA_API_KEY) {
    console.warn("⚠️ EXA_API_KEY is missing")
    return []
  }

  try {
    const response = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": EXA_API_KEY,
      },
      body: JSON.stringify({
        query,
        numResults: options.numResults || 5,
        useAutoprompt: options.useAutoprompt ?? true,
        type: options.type || "neural",
        contents: {
          text: options.includeText ?? true,
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Exa API error: ${response.status} ${errorText}`)
      return []
    }

    const data: ExaSearchResponse = await response.json()
    return data.results
  } catch (error) {
    console.error("Exa search failed:", error)
    return []
  }
}

/**
 * Find contact information or profile details for an email or domain
 */
export async function researchEntity(identity: string): Promise<string> {
  const query = `Find detailed professional information, social media profiles, and company background for: ${identity}`
  const results = await searchExa(query, { numResults: 3, includeText: true })
  
  return results.map(r => `--- ${r.title} (${r.url}) ---\n${r.text?.substring(0, 1000)}`).join("\n\n")
}
