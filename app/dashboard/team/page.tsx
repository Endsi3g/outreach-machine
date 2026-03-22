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
  const [pendingInvites, setPendingInvites] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  // ... forms ...
  const [newTeamName, setNewTeamName] = React.useState("")
  const [creating, setCreating] = React.useState(false)
  const [inviteTeamId, setInviteTeamId] = React.useState("")
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviting, setInviting] = React.useState(false)

  const fetchTeamData = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/teams", {
        headers: { "x-user-id": userId },
      })
      const data = await res.json()
      setTeams(data.teams || [])
      
      // Simulate/Fetch pending invites (actually we'll look for memberships where role is not 'none' but status is pending)
      // For now, let's filter teams where we might have a special flag or just handle it via a new list
      setPendingInvites(data.invites || [])
    } catch (error: any) {
      toast.error("Impossible de charger les données d'équipe")
    } finally {
      setLoading(false)
    }
  }, [userId])

  React.useEffect(() => {
    fetchTeamData()
  }, [fetchTeamData])

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return
    setCreating(true)
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: newTeamName }),
      })
      if (res.ok) {
        const { team } = await res.json()
        setTeams((prev) => [{ ...team, role: "owner" }, ...prev])
        setNewTeamName("")
        toast.success("Équipe créée !")
      }
    } catch (err) {
      toast.error("Erreur de création")
    } finally {
      setCreating(false)
    }
  }

  const handleRespondInvite = async (teamId: string, accept: boolean) => {
    try {
      const res = await fetch("/api/teams/invite", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, userId, accept }),
      })
      if (res.ok) {
        toast.success(accept ? "Invitation acceptée !" : "Invitation déclinée")
        fetchTeamData()
      }
    } catch (err) {
      toast.error("Erreur lors de la réponse")
    }
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Collaboration d&apos;Équipe</h1>
        <p className="text-muted-foreground">Travaillez ensemble sur vos campagnes et vos leads.</p>
      </div>

      {pendingInvites.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <IconUserPlus className="size-5 text-primary" />
              Invitations en attente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingInvites.map((invite) => (
              <div key={invite.team_id} className="flex items-center justify-between bg-background p-4 rounded-xl border">
                <div>
                  <p className="font-semibold">{invite.team_name}</p>
                  <p className="text-xs text-muted-foreground">Invité(e) par {invite.invited_by}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleRespondInvite(invite.team_id, true)}>Accepter</Button>
                  <Button size="sm" variant="ghost" onClick={() => handleRespondInvite(invite.team_id, false)}>Refuser</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Nouvelle Équipe</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="Nom de l'équipe (ex: Uprising Global)"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
            <Button onClick={handleCreateTeam} disabled={creating}>
              {creating ? <IconLoader2 className="size-4 animate-spin" /> : <IconPlus className="size-4" />}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Ajouter un Collaborateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              value={inviteTeamId}
              onChange={(e) => setInviteTeamId(e.target.value)}
              className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">Sélectionner une équipe...</option>
              {teams.filter(t => t.role === "owner" || t.role === "admin").map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <Input
                placeholder="email@collaborateur.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Button onClick={async () => {
                setInviting(true)
                try {
                  const res = await fetch("/api/teams/invite", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ teamId: inviteTeamId, email: inviteEmail, role: "member", invitedBy: userId })
                  })
                  if (res.ok) {
                    toast.success("Invitation envoyée !")
                    setInviteEmail("")
                  }
                } finally {
                  setInviting(false)
                }
              }} disabled={inviting || !inviteTeamId}>
                {inviting ? <IconLoader2 className="size-4 animate-spin" /> : <IconUserPlus className="size-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Mes Équipes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2].map(i => <div key={i} className="h-20 w-full bg-muted/20 animate-pulse rounded-xl" />)}
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <IconUsers className="size-12 mx-auto mb-4 opacity-20" />
              <p>Vous ne faites partie d&apos;aucune équipe.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {teams.map((team) => (
                <div key={team.id} className="group flex items-center justify-between p-5 rounded-2xl border bg-background/50 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      {team.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{team.name}</p>
                      <Badge variant="outline" className={cn("text-[10px] mt-1 uppercase tracking-wider", roleColors[team.role])}>
                        {roleLabels[team.role] || team.role}
                      </Badge>
                    </div>
                  </div>
                  {team.role === "owner" && (
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive" onClick={() => {
                       if(confirm("Supprimer cette équipe ?")) {
                         fetch("/api/teams", { method: "DELETE", body: JSON.stringify({ teamId: team.id, userId }) }).then(() => fetchTeamData())
                       }
                    }}>
                      <IconTrash className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

