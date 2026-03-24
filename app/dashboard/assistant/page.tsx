"use client"

import * as React from "react"
import { IconSend, IconMail, IconRefresh, IconLoader2, IconBriefcase, IconInbox, IconArrowBackUp } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  toolResults?: any[]
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

  const sendMessage = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || input.trim()
    if (!messageToSend || loading) return

    setMessages(prev => [...prev, { role: "user", content: messageToSend }])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: messages.map(m => ({ role: m.role, content: m.content })),
          message: messageToSend,
        }),
      })

      const data = await res.json()
      if (data.response) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: data.response,
          toolResults: data.toolResults 
        }])
      } else {
        toast.error(data.error || "Réponse vide de l'IA")
      }
    } catch (error: any) {
      toast.error("Erreur de connexion: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-2rem)] px-4 lg:px-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg">
            <IconMail className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Email Copilot</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Connecté à AgentMail.to
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMessages([])}
          className="text-muted-foreground"
        >
          <IconRefresh className="size-4 mr-2" />
          Réinitialiser
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden">
        {/* Sidebar / Quick Actions */}
        <Card className="hidden lg:flex flex-col col-span-1 border-none bg-zinc-50/50 dark:bg-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Actions Rapides</CardTitle>
            <CardDescription className="text-[10px]">Workflows automatisés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 px-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-xs h-9 bg-white dark:bg-zinc-900 border-zinc-200"
              onClick={() => sendMessage("Consulte ma boîte de réception AgentMail")}
            >
              <IconInbox className="size-3.5 mr-2 text-blue-500" />
              Consulter Inbox
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-xs h-9 bg-white dark:bg-zinc-900 border-zinc-200"
              onClick={() => setInput("Envoie un email de présentation à [Email] concernant [Sujet]")}
            >
              <IconBriefcase className="size-3.5 mr-2 text-indigo-500" />
              Intro Prospect
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-xs h-9 bg-white dark:bg-zinc-900 border-zinc-200"
              onClick={() => sendMessage("Réponds au dernier message reçu avec un merci")}
            >
              <IconArrowBackUp className="size-3.5 mr-2 text-orange-500" />
              Réponse Rapide
            </Button>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <div className="flex flex-col col-span-1 lg:col-span-3 h-full rounded-2xl border bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 pb-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                  <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
                    <IconMail className="size-8 text-zinc-400" />
                  </div>
                  <div className="max-w-xs space-y-1">
                    <p className="font-semibold text-lg italic">"Comment puis-je t'aider aujourd'hui ?"</p>
                    <p className="text-xs text-muted-foreground">Je peux gérer tes courriels, résumer ta boîte de réception ou préparer des introductions.</p>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white shadow-md rounded-tr-none"
                        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-tl-none border dark:border-zinc-800"
                    }`}
                  >
                    {msg.content}
                    
                    {msg.toolResults && msg.toolResults.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
                        {msg.toolResults.map((tool, j) => (
                          <div key={j} className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                             <CheckCircle2 className="size-3" />
                             Action effectuée: {tool.toolName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl px-4 py-3 text-sm flex items-center gap-3 border dark:border-zinc-800">
                    <IconLoader2 className="size-4 animate-spin text-indigo-500" />
                    <span className="text-zinc-500 animate-pulse">Email Agent réfléchit...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Footer Input */}
          <div className="p-4 border-t bg-zinc-50/50 dark:bg-black/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ex prime: 'Envoie un email à Marc pour confirmer notre meeting...'"
                className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-11 rounded-xl"
              />
              <Button 
                onClick={() => sendMessage()} 
                disabled={!input.trim() || loading}
                className="h-11 w-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none"
              >
                <IconSend className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  )
}
