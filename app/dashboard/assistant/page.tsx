"use client"

import * as React from "react"
import { IconSend, IconBrain, IconRefresh, IconLoader2 } from "@tabler/icons-react"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export default function AssistantPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: messages.map(m => ({ role: m.role, content: m.content })),
          message: userMessage,
        }),
      })

      const data = await res.json()
      if (data.response) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response }])
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: `Erreur: ${data.error || "Réponse vide"}` }])
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `Erreur de connexion: ${error.message}` }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-2rem)] px-4 lg:px-6 py-4 animate-page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <IconBrain className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Assistant IA</h1>
            <p className="text-sm text-muted-foreground">Kimi K-2.5 via Ollama — Stratégie d&apos;outreach & rédaction</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([])}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <IconRefresh className="size-4" />
          Nouvelle conversation
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto rounded-xl border bg-card p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
            <IconBrain className="size-12 opacity-30" />
            <div className="text-center">
              <p className="font-medium">Bienvenue dans l&apos;Assistant IA</p>
              <p className="text-sm">Posez vos questions sur la stratégie d&apos;outreach, demandez de rédiger des emails, ou discutez de vos campagnes.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg">
              {[
                "Rédige un email pour un restaurant à Montréal",
                "Quelle stratégie pour une campagne B2B?",
                "Aide-moi à améliorer mon taux de réponse",
                "Crée une séquence de 3 emails de follow-up",
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="rounded-lg border px-3 py-2 text-left text-xs hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-secondary text-secondary-foreground rounded-xl px-4 py-3 text-sm flex items-center gap-2">
              <IconLoader2 className="size-4 animate-spin" />
              L&apos;IA réfléchit...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="mt-3 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez votre message…"
          rows={1}
          className="flex-1 resize-none rounded-xl border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          style={{ minHeight: "44px", maxHeight: "120px" }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <IconSend className="size-4" />
        </button>
      </div>
    </div>
  )
}
