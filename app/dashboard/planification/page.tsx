"use client"

import * as React from "react"
import {
  IconCalendar,
  IconMail,
  IconSend,
  IconPlus,
  IconTrash,
  IconLoader2,
  IconCheck,
  IconClock,
  IconBrain,
  IconSearch,
} from "@tabler/icons-react"

interface Task {
  id: string
  type: "email" | "campaign" | "research" | "custom"
  title: string
  description: string
  status: "pending" | "scheduled" | "running" | "completed" | "failed"
  scheduledAt: string | null
  completedAt: string | null
  data: Record<string, any>
  createdAt: string
}

interface EmailDraft {
  prospect: string
  company: string
  email: string
  status: "draft" | "approved" | "scheduled" | "sent"
  scheduledAt?: string
}

export default function PlanificationPage() {
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [emailDrafts, setEmailDrafts] = React.useState<EmailDraft[]>([])
  const [loading, setLoading] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"planning" | "emails" | "tasks">("planning")
  
  // Mass email generation form
  const [massForm, setMassForm] = React.useState({
    prospects: "",
    customPrompt: "",
    scheduledDate: "",
    scheduledTime: "",
  })

  // AI Chat state
  const [chatInput, setChatInput] = React.useState("")
  const [chatMessages, setChatMessages] = React.useState<{ role: string; content: string }[]>([])
  const [chatLoading, setChatLoading] = React.useState(false)

  // Fetch tasks on mount
  React.useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks")
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || [])
      }
    } catch {
      // silent
    }
  }

  const generateMassEmails = async () => {
    if (!massForm.prospects.trim()) return
    setLoading(true)

    const prospects = massForm.prospects.split("\n").filter(Boolean).map(line => {
      const parts = line.split(",").map(s => s.trim())
      return { name: parts[0] || "", company: parts[1] || "" }
    })

    const drafts: EmailDraft[] = []

    for (const prospect of prospects) {
      try {
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prospectName: prospect.name,
            companyName: prospect.company,
            customPrompt: massForm.customPrompt,
          }),
        })
        const data = await res.json()
        drafts.push({
          prospect: prospect.name,
          company: prospect.company,
          email: data.email || "Erreur de génération",
          status: "draft",
        })
      } catch {
        drafts.push({
          prospect: prospect.name,
          company: prospect.company,
          email: "Erreur de génération",
          status: "draft",
        })
      }
    }

    setEmailDrafts(prev => [...prev, ...drafts])
    setLoading(false)
    setActiveTab("emails")
  }

  const scheduleEmail = async (index: number) => {
    const draft = emailDrafts[index]
    if (!massForm.scheduledDate) return

    const scheduledAt = `${massForm.scheduledDate}T${massForm.scheduledTime || "09:00"}`

    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "email",
          title: `Email → ${draft.prospect} (${draft.company})`,
          description: draft.email.substring(0, 200),
          scheduledAt,
          data: { email: draft.email, prospect: draft.prospect, company: draft.company },
        }),
      })

      setEmailDrafts(prev => prev.map((d, i) => 
        i === index ? { ...d, status: "scheduled", scheduledAt } : d
      ))
      fetchTasks()
    } catch {
      // silent
    }
  }

  const scheduleAllEmails = async () => {
    const pendingDrafts = emailDrafts.filter(d => d.status === "draft")
    for (let i = 0; i < emailDrafts.length; i++) {
      if (emailDrafts[i].status === "draft") {
        await scheduleEmail(i)
      }
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return
    const msg = chatInput.trim()
    setChatInput("")
    setChatMessages(prev => [...prev, { role: "user", content: msg }])
    setChatLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: chatMessages, message: msg }),
      })
      const data = await res.json()
      setChatMessages(prev => [...prev, { role: "assistant", content: data.response || data.error }])
    } catch (e: any) {
      setChatMessages(prev => [...prev, { role: "assistant", content: `Erreur: ${e.message}` }])
    } finally {
      setChatLoading(false)
    }
  }

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks?id=${id}`, { method: "DELETE" })
    fetchTasks()
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed": return <IconCheck className="size-4 text-green-600" />
      case "scheduled": return <IconClock className="size-4 text-blue-600" />
      case "running": return <IconLoader2 className="size-4 animate-spin text-orange-500" />
      default: return <IconClock className="size-4 text-muted-foreground" />
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 animate-page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Planification</h1>
          <p className="text-sm text-muted-foreground">Planifiez vos campagnes d&apos;emails en masse, communiquez avec l&apos;IA et gérez vos tâches</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-secondary p-1">
        {[
          { id: "planning" as const, label: "Création en masse", icon: IconMail },
          { id: "emails" as const, label: `Brouillons (${emailDrafts.length})`, icon: IconSend },
          { id: "tasks" as const, label: `Tâches (${tasks.length})`, icon: IconCalendar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main content */}
        <div className="lg:col-span-2">
          {activeTab === "planning" && (
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h2 className="font-semibold">Génération d&apos;emails en masse</h2>
              <div>
                <label className="text-sm font-medium">Prospects (un par ligne: Nom, Entreprise)</label>
                <textarea
                  value={massForm.prospects}
                  onChange={(e) => setMassForm(prev => ({ ...prev, prospects: e.target.value }))}
                  placeholder={"Jean Dupont, Restaurant Le Bon Goût\nMarie Tremblay, Salon Beauté Luxe\nPierre Martin, Construction PMR"}
                  rows={5}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Instructions personnalisées pour l&apos;IA</label>
                <textarea
                  value={massForm.customPrompt}
                  onChange={(e) => setMassForm(prev => ({ ...prev, customPrompt: e.target.value }))}
                  placeholder="Ex: Mentionne notre offre de 20% de rabais, insiste sur le SEO local, ton amical et direct…"
                  rows={3}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Date d&apos;envoi</label>
                  <input
                    type="date"
                    value={massForm.scheduledDate}
                    onChange={(e) => setMassForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Heure d&apos;envoi</label>
                  <input
                    type="time"
                    value={massForm.scheduledTime}
                    onChange={(e) => setMassForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <button
                onClick={generateMassEmails}
                disabled={loading || !massForm.prospects.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <IconLoader2 className="size-4 animate-spin" />
                    Génération en cours…
                  </>
                ) : (
                  <>
                    <IconBrain className="size-4" />
                    Générer les emails avec Kimi K-2.5
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "emails" && (
            <div className="space-y-3">
              {emailDrafts.length === 0 ? (
                <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
                  <IconMail className="mx-auto size-10 opacity-30 mb-3" />
                  <p>Aucun brouillon. Générez des emails depuis l&apos;onglet Création en masse.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-end">
                    <button
                      onClick={scheduleAllEmails}
                      className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <IconCalendar className="size-4" />
                      Planifier tous les brouillons
                    </button>
                  </div>
                  {emailDrafts.map((draft, i) => (
                    <div key={i} className="rounded-xl border bg-card p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{draft.prospect}</span>
                          <span className="text-xs text-muted-foreground">— {draft.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            draft.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                            draft.status === "approved" ? "bg-green-100 text-green-700" :
                            draft.status === "sent" ? "bg-primary/10 text-primary" :
                            "bg-secondary text-secondary-foreground"
                          }`}>
                            {statusIcon(draft.status === "scheduled" ? "scheduled" : "pending")}
                            {draft.status === "draft" ? "Brouillon" :
                             draft.status === "scheduled" ? "Planifié" :
                             draft.status === "approved" ? "Approuvé" : "Envoyé"}
                          </span>
                          {draft.status === "draft" && (
                            <button
                              onClick={() => scheduleEmail(i)}
                              className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent transition-colors"
                            >
                              <IconCalendar className="size-3" />
                              Planifier
                            </button>
                          )}
                        </div>
                      </div>
                      <pre className="text-xs bg-secondary/50 rounded-lg p-3 whitespace-pre-wrap font-sans max-h-40 overflow-y-auto">
                        {draft.email}
                      </pre>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
                  <IconCalendar className="mx-auto size-10 opacity-30 mb-3" />
                  <p>Aucune tâche planifiée. Planifiez des emails ou créez des campagnes.</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="rounded-xl border bg-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {statusIcon(task.status)}
                      <div>
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.scheduledAt ? `Planifié pour: ${new Date(task.scheduledAt).toLocaleString("fr-CA")}` : task.status}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <IconTrash className="size-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* AI Chat Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card flex flex-col h-[600px]">
            <div className="px-4 py-3 border-b flex items-center gap-2">
              <IconBrain className="size-4 text-primary" />
              <span className="text-sm font-medium">Assistant IA</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.length === 0 && (
                <p className="text-xs text-muted-foreground text-center mt-8">
                  Discutez avec l&apos;IA pour affiner vos emails ou stratégies
                </p>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[90%] rounded-lg px-3 py-2 text-xs whitespace-pre-wrap ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-lg px-3 py-2 text-xs flex items-center gap-1">
                    <IconLoader2 className="size-3 animate-spin" /> Réflexion…
                  </div>
                </div>
              )}
            </div>
            <div className="border-t p-2 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                placeholder="Votre message…"
                className="flex-1 rounded-md border px-2 py-1.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                onClick={sendChatMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="flex items-center justify-center rounded-md bg-primary text-primary-foreground h-7 w-7 disabled:opacity-50 transition-colors"
              >
                <IconSend className="size-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
