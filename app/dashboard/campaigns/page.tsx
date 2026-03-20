"use client"

import * as React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconPlus, IconPlayerPlay, IconPlayerPause, IconLoader2, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

interface Campaign {
  id: string
  name: string
  status: "draft" | "active" | "paused" | "completed"
  total_leads: number
  sent: number
  opened: number
  replied: number
  created_at: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Brouillon", className: "bg-gray-100 text-gray-800" },
  active: { label: "Active", className: "bg-green-100 text-green-800" },
  paused: { label: "En pause", className: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Terminée", className: "bg-blue-100 text-blue-800" },
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchCampaigns = React.useCallback(async () => {
    try {
      setLoading(true)
      // We will create this API route shortly
      const res = await fetch("/api/campaigns")
      if (!res.ok) throw new Error("Erreur de chargement")
      const data = await res.json()
      setCampaigns(data.campaigns || [])
    } catch (error: any) {
      toast.error(error.message || "Impossible de charger les campagnes")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/campaigns", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Erreur lors de la suppression")
      setCampaigns((prev) => prev.filter((c) => c.id !== id))
      toast.success("Campagne supprimée avec succès")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const toggleStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (!res.ok) throw new Error("Erreur de mise à jour")
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus as any } : c))
      )
      toast.success("Statut mis à jour")
    } catch (error: any) {
      toast.error("Erreur : Impossible de modifier la campagne")
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Campagnes</h1>
        <Button size="sm">
          <IconPlus className="mr-2 size-4" />
          Nouvelle campagne
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-8">
            <IconLoader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : campaigns.length === 0 ? (
          <Card className="flex items-center justify-center p-8">
            <div className="text-center text-muted-foreground">
              Aucune campagne trouvée. Créez-en une nouvelle.
            </div>
          </Card>
        ) : (
          campaigns.map((campaign) => {
            const openRate =
              campaign.sent > 0
                ? ((campaign.opened / campaign.sent) * 100).toFixed(1)
                : "0"
            const replyRate =
              campaign.sent > 0
                ? ((campaign.replied / campaign.sent) * 100).toFixed(1)
                : "0"

            return (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{campaign.name}</CardTitle>
                        <Badge
                          variant="outline"
                          className={`text-xs ${statusConfig[campaign.status]?.className || ""}`}
                        >
                          {statusConfig[campaign.status]?.label || campaign.status}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        Créée le {new Date(campaign.created_at).toLocaleDateString("fr-FR")} ·{" "}
                        {campaign.total_leads || 0} leads
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {campaign.status === "draft" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(campaign.id, "active")}
                        >
                          <IconPlayerPlay className="mr-2 size-4" />
                          Lancer
                        </Button>
                      )}
                      {campaign.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(campaign.id, "paused")}
                        >
                          <IconPlayerPause className="mr-2 size-4" />
                          Pause
                        </Button>
                      )}
                      {campaign.status === "paused" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(campaign.id, "active")}
                        >
                          <IconPlayerPlay className="mr-2 size-4" />
                          Reprendre
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(campaign.id)}
                      >
                        <IconTrash className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <div className="flex gap-6 px-6 pb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{campaign.sent || 0}</div>
                    <div className="text-xs text-muted-foreground">Envoyés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{openRate}%</div>
                    <div className="text-xs text-muted-foreground">Ouverture</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{replyRate}%</div>
                    <div className="text-xs text-muted-foreground">Réponse</div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
