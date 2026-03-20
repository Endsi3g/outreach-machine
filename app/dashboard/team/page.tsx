"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  IconPlus,
  IconLoader2,
  IconTrash,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface Team {
  id: string
  name: string
  owner_id: string
  role: string
  created_at: string
}

const roleLabels: Record<string, string> = {
  owner: "Propriétaire",
  admin: "Admin",
  member: "Membre",
}

const roleColors: Record<string, string> = {
  owner: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  member: "bg-gray-100 text-gray-800",
}

export default function TeamPage() {
  const { data: session } = useSession()
  const userId = session?.user?.email || "anonymous"
  const [teams, setTeams] = React.useState<Team[]>([])
  const [loading, setLoading] = React.useState(true)

  // Create team form
  const [newTeamName, setNewTeamName] = React.useState("")
  const [creating, setCreating] = React.useState(false)

  // Invite form
  const [inviteTeamId, setInviteTeamId] = React.useState("")
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviting, setInviting] = React.useState(false)

  const fetchTeams = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/teams", {
        headers: { "x-user-id": userId },
      })
      if (!res.ok) throw new Error("Erreur de chargement")
      const data = await res.json()
      setTeams(data.teams || [])
    } catch (error: any) {
      toast.error(error.message || "Impossible de charger les équipes")
    } finally {
      setLoading(false)
    }
  }, [userId])

  React.useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error("Veuillez entrer un nom d'équipe")
      return
    }
    setCreating(true)
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: newTeamName }),
      })
      if (!res.ok) throw new Error("Erreur lors de la création")
      const { team } = await res.json()
      setTeams((prev) => [{ ...team, role: "owner" }, ...prev])
      setNewTeamName("")
      toast.success("Équipe créée avec succès !")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const res = await fetch("/api/teams", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, userId }),
      })
      if (!res.ok) throw new Error("Erreur de suppression")
      setTeams((prev) => prev.filter((t) => t.id !== teamId))
      toast.success("Équipe supprimée")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleInvite = async () => {
    if (!inviteTeamId || !inviteEmail) {
      toast.error("Sélectionnez une équipe et entrez un email")
      return
    }
    setInviting(true)
    try {
      const res = await fetch("/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: inviteTeamId,
          email: inviteEmail,
          role: "member",
          invitedBy: userId,
        }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Erreur d'invitation")
      }
      toast.success(`${inviteEmail} a été invité(e) !`)
      setInviteEmail("")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setInviting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Équipe</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create Team */}
        <Card>
          <CardHeader>
            <CardTitle>Créer une équipe</CardTitle>
            <CardDescription>
              Les membres de l&apos;équipe pourront accéder aux leads et campagnes partagées.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="Nom de l'équipe"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateTeam()}
            />
            <Button onClick={handleCreateTeam} disabled={creating} className="shrink-0">
              {creating ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                <IconPlus className="size-4" />
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Invite Member */}
        <Card>
          <CardHeader>
            <CardTitle>Inviter un membre</CardTitle>
            <CardDescription>
              Ajoutez un collaborateur par email à l&apos;une de vos équipes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label>Équipe</Label>
              <select
                value={inviteTeamId}
                onChange={(e) => setInviteTeamId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <option value="">Sélectionner...</option>
                {teams
                  .filter((t) => t.role === "owner" || t.role === "admin")
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="email@collaborateur.com"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Button onClick={handleInvite} disabled={inviting} className="shrink-0">
                {inviting ? (
                  <IconLoader2 className="size-4 animate-spin" />
                ) : (
                  <IconUserPlus className="size-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teams List */}
      <Card>
        <CardHeader>
          <CardTitle>Mes équipes</CardTitle>
          <CardDescription>
            {loading ? "Chargement..." : `${teams.length} équipe${teams.length > 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : teams.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center text-muted-foreground">
              <IconUsers className="size-8" />
              <p>Aucune équipe pour le moment. Créez-en une ci-dessus !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-sm font-semibold">
                      {team.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Créée le{" "}
                        {new Date(team.created_at).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${roleColors[team.role] || ""}`}
                    >
                      {roleLabels[team.role] || team.role}
                    </Badge>
                    {team.role === "owner" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteTeam(team.id)}
                      >
                        <IconTrash className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
