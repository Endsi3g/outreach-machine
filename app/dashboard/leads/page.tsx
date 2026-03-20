"use client"

import * as React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  IconPlus,
  IconSearch,
  IconUpload,
  IconTrash,
  IconLoader2,
} from "@tabler/icons-react"
import { toast } from "sonner"

interface Lead {
  id: string
  name: string
  email: string
  company: string
  position: string
  status: string
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  replied: "bg-green-100 text-green-800",
  qualified: "bg-purple-100 text-purple-800",
}

export default function LeadsPage() {
  const [leads, setLeads] = React.useState<Lead[]>([])
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  const fetchLeads = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/leads")
      if (!res.ok) throw new Error("Erreur de chargement")
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (error: any) {
      toast.error(error.message || "Impossible de charger les leads")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const filteredLeads = leads.filter(
    (l) =>
      (l.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (l.company?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (l.email?.toLowerCase() || "").includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Erreur lors de la suppression")
      setLeads((prev) => prev.filter((l) => l.id !== id))
      toast.success("Lead supprimé avec succès")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <IconUpload className="mr-2 size-4" />
            Importer CSV
          </Button>
          <Button size="sm">
            <IconPlus className="mr-2 size-4" />
            Ajouter un lead
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Base de données</CardTitle>
              <CardDescription>
                {loading ? "Chargement..." : `${leads.length} lead${leads.length > 1 ? "s" : ""} au total`}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <div className="px-6 pb-6">
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Nom</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Entreprise</th>
                  <th className="px-4 py-3 text-left font-medium">Poste</th>
                  <th className="px-4 py-3 text-left font-medium">Statut</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      <IconLoader2 className="mx-auto size-6 animate-spin mb-2" />
                      Chargement des leads...
                    </td>
                  </tr>
                ) : filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{lead.name || "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{lead.email || "-"}</td>
                      <td className="px-4 py-3">{lead.company || "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{lead.position || "-"}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-xs ${statusColors[lead.status] || ""}`}
                        >
                          {lead.status || "new"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(lead.id)}
                          className="size-8 text-muted-foreground hover:text-destructive"
                        >
                          <IconTrash className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Aucun lead trouvé. Ajoutez-en un pour commencer !
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}
