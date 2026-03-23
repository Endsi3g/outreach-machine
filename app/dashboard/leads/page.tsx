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
  IconX,
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
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [addForm, setAddForm] = React.useState({ name: "", email: "", company: "", position: "" })
  const [addLoading, setAddLoading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

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

  const handleAddLead = async () => {
    if (!addForm.name.trim()) {
      toast.error("Le nom est requis")
      return
    }
    setAddLoading(true)
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erreur de création")
      }
      const data = await res.json()
      if (data.lead) {
        setLeads((prev) => [data.lead, ...prev])
      }
      setAddForm({ name: "", email: "", company: "", position: "" })
      setShowAddForm(false)
      toast.success("Lead ajouté avec succès")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setAddLoading(false)
    }
  }

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const lines = text.split("\n").filter(Boolean)
    if (lines.length < 2) {
      toast.error("Le fichier CSV doit contenir au moins un en-tête et une ligne de données")
      return
    }

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
    const nameIdx = headers.findIndex(h => h.includes("nom") || h.includes("name"))
    const emailIdx = headers.findIndex(h => h.includes("email") || h.includes("courriel"))
    const companyIdx = headers.findIndex(h => h.includes("entreprise") || h.includes("company") || h.includes("compagnie"))
    const positionIdx = headers.findIndex(h => h.includes("poste") || h.includes("position") || h.includes("titre"))

    let importedCount = 0
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g, ""))
      const lead = {
        name: nameIdx >= 0 ? cols[nameIdx] : cols[0] || "",
        email: emailIdx >= 0 ? cols[emailIdx] : cols[1] || "",
        company: companyIdx >= 0 ? cols[companyIdx] : cols[2] || "",
        position: positionIdx >= 0 ? cols[positionIdx] : cols[3] || "",
      }
      if (!lead.name) continue

      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.lead) setLeads(prev => [data.lead, ...prev])
          importedCount++
        }
      } catch {
        // continue with next
      }
    }

    toast.success(`${importedCount} leads importés avec succès`)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8 animate-page-enter">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleCSVImport}
            className="hidden"
          />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <IconUpload className="mr-2 size-4" />
            Importer CSV
          </Button>
          <Button size="sm" onClick={() => setShowAddForm(true)}>
            <IconPlus className="mr-2 size-4" />
            Ajouter un lead
          </Button>
        </div>
      </div>

      {/* Add Lead Form */}
      {showAddForm && (
        <Card className="p-4 space-y-3 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Nouveau lead</h3>
            <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
              <IconX className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Nom *" value={addForm.name} onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))} />
            <Input placeholder="Email" type="email" value={addForm.email} onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))} />
            <Input placeholder="Entreprise" value={addForm.company} onChange={(e) => setAddForm(prev => ({ ...prev, company: e.target.value }))} />
            <Input placeholder="Poste" value={addForm.position} onChange={(e) => setAddForm(prev => ({ ...prev, position: e.target.value }))} />
          </div>
          <Button onClick={handleAddLead} disabled={addLoading} className="w-full sm:w-auto">
            {addLoading ? <IconLoader2 className="mr-2 size-4 animate-spin" /> : <IconPlus className="mr-2 size-4" />}
            {addLoading ? "Ajout en cours…" : "Ajouter"}
          </Button>
        </Card>
      )}

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
