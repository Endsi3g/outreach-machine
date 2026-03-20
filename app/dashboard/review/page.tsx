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
  status: "pending" | "approved" | "rejected" | "sent"
  lead_id?: string
  leads?: { name: string } // Joined from Supabase
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approuvé", className: "bg-green-100 text-green-800" },
  rejected: { label: "Rejeté", className: "bg-red-100 text-red-800" },
  sent: { label: "Envoyé", className: "bg-blue-100 text-blue-800" },
}

export default function ReviewPage() {
  const [emails, setEmails] = React.useState<Email[]>([])
  const [loading, setLoading] = React.useState(true)

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
      toast.success(newStatus === "approved" ? "Email approuvé" : "Email rejeté")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleSendApproved = async () => {
    // In reality, this would trigger a batch send via Resend
    toast.success("Envoi des emails approuvés en cours...")
    // Simulate moving to "sent"
    setEmails((prev) =>
      prev.map((e) => (e.status === "approved" ? { ...e, status: "sent" } : e))
    )
  }

  const pendingCount = emails.filter((e) => e.status === "pending").length
  const approvedCount = emails.filter((e) => e.status === "approved").length

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Réviser</h1>
          <p className="text-sm text-muted-foreground">
            {pendingCount} en attente · {approvedCount} approuvé{approvedCount > 1 ? "s" : ""}
          </p>
        </div>
        <Button disabled={approvedCount === 0 || loading} onClick={handleSendApproved}>
          <IconSend className="mr-2 size-4" />
          Envoyer {approvedCount} email{approvedCount > 1 ? "s" : ""}
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-8">
            <IconLoader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : emails.length === 0 ? (
          <Card className="flex items-center justify-center p-8">
            <div className="text-center text-muted-foreground">
              Aucun email à réviser. Générez des emails depuis la page "Générer".
            </div>
          </Card>
        ) : (
          emails.map((email) => (
            <Card key={email.id}>
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{email.subject || "Sans sujet"}</CardTitle>
                      <Badge
                        variant="outline"
                        className={`text-xs ${statusConfig[email.status]?.className || ""}`}
                      >
                        {statusConfig[email.status]?.label || email.status}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">
                      À : {email.leads?.name || "Lead inconnu"}
                    </CardDescription>
                  </div>
                  {email.status === "pending" && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={() => updateStatus(email.id, "approved")}
                      >
                        <IconCheck className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8">
                        <IconEdit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => updateStatus(email.id, "rejected")}
                      >
                        <IconX className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <div className="px-6 pb-4">
                <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
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
