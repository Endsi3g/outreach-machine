"use client"

import * as React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { IconCheck, IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  // Profile data
  const [companyName, setCompanyName] = React.useState("")
  const [senderName, setSenderName] = React.useState("")
  const [senderEmail, setSenderEmail] = React.useState("")

  // API settings
  const [ollamaUrl, setOllamaUrl] = React.useState("http://localhost:11434")
  const [ollamaModel, setOllamaModel] = React.useState("llama3.1")
  const [resendKey, setResendKey] = React.useState("")
  const [apifyToken, setApifyToken] = React.useState("")

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const data = await res.json()
          if (data.profile) {
            setCompanyName(data.profile.company_name || "")
            setSenderName(data.profile.sender_name || "")
            setSenderEmail(data.profile.sender_email || "")
          }
        }
      } catch (error) {
        console.error("Failed to load profile", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session?.user?.email || "anonymous",
        },
        body: JSON.stringify({
          companyName,
          senderName,
          senderEmail,
        }),
      })

      if (!res.ok) throw new Error("Erreur de sauvegarde")
      toast.success("Profil sauvegardé avec succès !")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveApiKeys = () => {
    // In reality, API keys should be stored in env vars (.env.local) 
    // or securely encrypted in the DB. 
    // Since this is a local app showing Env Var integration, we just mock the success.
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success("Clés API sauvegardées (Simulation locale)")
    }, 800)
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <IconLoader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
      </div>

      <div className="grid gap-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Profil d&apos;Expéditeur</CardTitle>
            </div>
            <CardDescription>
              Informations utilisées pour personnaliser et envoyer vos emails.
            </CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4 px-6 pb-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="companyName">Entreprise</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="senderName">Nom d&apos;expéditeur</Label>
                <Input
                  id="senderName"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="senderEmail">Email d&apos;expédition</Label>
                <Input
                  id="senderEmail"
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="w-full sm:w-auto mt-2">
              {saving ? <IconLoader2 className="mr-2 size-4 animate-spin" /> : <IconCheck className="mr-2 size-4" />}
              Sauvegarder le profil
            </Button>
          </div>
        </Card>

        {/* Ollama */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Ollama (IA locale)</CardTitle>
              <Badge variant="outline" className="text-xs">Gratuit</Badge>
            </div>
            <CardDescription>
              Connectez-vous à votre instance Ollama locale pour la génération d&apos;emails IA.
            </CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4 px-6 pb-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="ollamaUrl">URL du serveur (défaut dans .env.local)</Label>
                <Input
                  id="ollamaUrl"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ollamaModel">Modèle</Label>
                <Input
                  id="ollamaModel"
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Resend & Apify */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Intégrations API</CardTitle>
              <Badge variant="outline" className="text-xs">Externe</Badge>
            </div>
            <CardDescription>
              Configurez vos clés pour l&apos;envoi d&apos;emails (Resend) et le scraping (Apify).
            </CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4 px-6 pb-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="resendKey">Clé API Resend</Label>
                <Input
                  id="resendKey"
                  type="password"
                  placeholder="Définie dans .env.local"
                  value={resendKey}
                  onChange={(e) => setResendKey(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="apifyToken">Token API Apify</Label>
                <Input
                  id="apifyToken"
                  type="password"
                  placeholder="Définie dans .env.local"
                  value={apifyToken}
                  onChange={(e) => setApifyToken(e.target.value)}
                />
              </div>
            </div>
            <Button variant="secondary" onClick={handleSaveApiKeys} disabled={saving} className="w-full sm:w-auto mt-2">
              {saving ? <IconLoader2 className="mr-2 size-4 animate-spin" /> : <IconCheck className="mr-2 size-4" />}
              Mettre à jour les clés API
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
