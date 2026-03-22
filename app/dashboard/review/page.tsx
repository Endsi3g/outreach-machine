"use client"

import * as React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconCheck,
  IconEdit,
  IconX,
  IconSend,
  IconLoader2,
} from "@tabler/icons-react"
import { toast } from "sonner"

interface Email {
  id: string
  subject: string
  body: string
  status: "pending" | "approved" | "rejected" | "sent" | "error" | "read"
  lead_id?: string
  leads?: { name: string; email?: string }
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-yellow-100/80 text-yellow-800 border-yellow-200" },
  approved: { label: "Approuvé", className: "bg-green-100/80 text-green-800 border-green-200" },
  rejected: { label: "Rejeté", className: "bg-red-100/80 text-red-800 border-red-200" },
  sent: { label: "Envoyé", className: "bg-blue-100/80 text-blue-800 border-blue-200" },
  read: { label: "Lu", className: "bg-emerald-100/80 text-emerald-800 border-emerald-200" },
  error: { label: "Erreur", className: "bg-orange-100/80 text-orange-800 border-orange-200" },
}

export default function ReviewPage() {
  const [emails, setEmails] = React.useState<Email[]>([])
  const [loading, setLoading] = React.useState(true)
  const [sending, setSending] = React.useState(false)

  const fetchEmails = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/emails")
      if (!res.ok) throw new Error("Erreur de chargement")
      const data = await res.json()
      setEmails(data.emails || [])
    } catch (error: any) {
      toast.error(error.message || "Impossible de charger les emails")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchEmails()
  }, [fetchEmails])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/emails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (!res.ok) throw new Error("Erreur de mise à jour")
      setEmails((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus as any } : e))
      )
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleSendApproved = async () => {
    const toSend = emails.filter((e) => e.status === "approved")
    if (toSend.length === 0) return

    setSending(true)
    let successCount = 0
    let errorCount = 0

    for (const email of toSend) {
      try {
        const res = await fetch("/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: (email as any).leads?.email || "contact@uprising-studio.io", // Fallback if missing
            subject: email.subject,
            body: email.body,
          }),
        })

        if (res.ok) {
          await updateStatus(email.id, "sent")
          successCount++
        } else {
          await updateStatus(email.id, "error")
          errorCount++
        }
      } catch (err) {
        await updateStatus(email.id, "error")
        errorCount++
      }
    }

    setSending(false)
    toast.success(`${successCount} emails envoyés avec succès.`)
    if (errorCount > 0) {
      toast.error(`${errorCount} erreurs d'envoi.`)
    }
  }

  const pendingCount = emails.filter((e) => e.status === "pending").length
  const approvedCount = emails.filter((e) => e.status === "approved").length

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Révision des Emails</h1>
          <p className="text-muted-foreground mt-1">
            {pendingCount} en attente · {approvedCount} prêt{approvedCount > 1 ? "s" : ""} à l&apos;envoi
          </p>
        </div>
        <Button 
          disabled={approvedCount === 0 || loading || sending} 
          onClick={handleSendApproved}
          className="bg-primary hover:bg-primary/90 transition-all font-medium"
        >
          {sending ? (
            <IconLoader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <IconSend className="mr-2 size-4" />
          )}
          {sending ? "Envoi en cours..." : `Lancer l'automatisation (${approvedCount})`}
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3 border rounded-xl bg-muted/20">
            <IconLoader2 className="size-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Chargement de votre boîte d&apos;outreach...</p>
          </div>
        ) : emails.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 bg-card/50 border-dashed border-2">
            <IconMail className="size-12 text-muted-foreground/30 mb-4" />
            <div className="text-center text-muted-foreground">
              Aucun email à réviser.
              <p className="text-sm mt-1">Générez des emails personnalisés pour commencer.</p>
            </div>
          </Card>
        ) : (
          emails.map((email) => (
            <Card key={email.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors bg-card/50">
              <CardHeader className="pb-3 px-6 pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{email.subject || "Sans sujet"}</h3>
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-medium ${statusConfig[email.status]?.className || ""}`}
                      >
                        {statusConfig[email.status]?.label || email.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      Destinataire : <span className="text-foreground font-medium">{email.leads?.name || "Lead inconnu"}</span>
                    </CardDescription>
                  </div>
                  {(email.status === "pending" || email.status === "error") && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 text-green-600 hover:bg-green-50 border-green-200"
                        onClick={() => updateStatus(email.id, "approved")}
                      >
                        <IconCheck className="mr-1.5 size-4" />
                        Approuver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 text-red-600 hover:bg-red-50 border-red-200"
                        onClick={() => updateStatus(email.id, "rejected")}
                      >
                        <IconX className="mr-1.5 size-4" />
                        Rejeter
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <div className="px-6 pb-6 pt-0">
                <div className="rounded-xl border bg-background/80 p-5 text-sm leading-relaxed whitespace-pre-wrap font-sans text-muted-foreground border-border/40">
                  {email.body || "Pas de contenu"}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

