"use client"

import * as React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { IconCheck, IconLoader2, IconShieldLock, IconKey } from "@tabler/icons-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const userId = session?.user?.email || "anonymous"
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [savingKeys, setSavingKeys] = React.useState(false)

  // Profile
  const [companyName, setCompanyName] = React.useState("")
  const [senderName, setSenderName] = React.useState("")
  const [senderEmail, setSenderEmail] = React.useState("")

  // API Keys (from user_settings table, encrypted)
  const [ollamaUrl, setOllamaUrl] = React.useState("http://localhost:11434")
  const [ollamaModel, setOllamaModel] = React.useState("kimi:k2-5")
  const [resendKey, setResendKey] = React.useState("")
  const [apifyToken, setApifyToken] = React.useState("")
  const [sentryDsn, setSentryDsn] = React.useState("")
  const [hasResendKey, setHasResendKey] = React.useState(false)
  const [hasApifyToken, setHasApifyToken] = React.useState(false)
  const [preferredProvider, setPreferredProvider] = React.useState("resend")

  // Load profile + settings
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, settingsRes] = await Promise.all([
          fetch("/api/profile", { headers: { "x-user-id": userId } }),
          fetch("/api/settings", { headers: { "x-user-id": userId } }),
        ])

        if (profileRes.ok) {
          const { profile } = await profileRes.json()
          if (profile) {
            setCompanyName(profile.company_name || "")
            setSenderName(profile.sender_name || "")
            setSenderEmail(profile.sender_email || "")
          }
        }

        if (settingsRes.ok) {
          const { settings } = await settingsRes.json()
          if (settings) {
            setOllamaUrl(settings.ollama_url || "http://localhost:11434")
            setOllamaModel(settings.ollama_model || "llama3.1")
            setSentryDsn(settings.sentry_dsn || "")
            setResendKey(settings.resend_api_key || "")
            setApifyToken(settings.apify_token || "")
            setHasResendKey(settings.has_resend_key || false)
            setHasApifyToken(settings.has_apify_token || false)
            setPreferredProvider(settings.preferred_outreach_provider || "resend")
          }
        }
      } catch (error) {
        console.error("Failed to load settings", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userId])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ companyName, senderName, senderEmail }),
      })
      if (!res.ok) throw new Error("Erreur de sauvegarde")
      toast.success("Profil sauvegardé !")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveKeys = async () => {
    setSavingKeys(true)
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({
          ollamaUrl,
          ollamaModel,
          resendApiKey: resendKey,
          apifyToken,
          sentryDsn,
          preferredProvider,
        }),
      })
      if (!res.ok) throw new Error("Erreur de sauvegarde des clés")
      toast.success("Clés API sauvegardées et chiffrées !")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSavingKeys(false)
    }
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
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
      </div>

      <div className="grid gap-6">
        {/* ---- Profile ---- */}
        <Card>
          <CardHeader>
            <CardTitle>Profil d&apos;Expéditeur</CardTitle>
            <CardDescription>
              Informations utilisées pour personnaliser et envoyer vos emails.
            </CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4 px-6 pb-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="companyName">Entreprise</Label>
                <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="senderName">Nom d&apos;expéditeur</Label>
                <Input id="senderName" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="senderEmail">Email d&apos;expédition</Label>
                <Input id="senderEmail" type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="w-full sm:w-auto mt-2">
              {saving ? <IconLoader2 className="mr-2 size-4 animate-spin" /> : <IconCheck className="mr-2 size-4" />}
              Sauvegarder le profil
            </Button>
          </div>
        </Card>

        <Separator />

        {/* ---- API Keys (encrypted) ---- */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Clés API &amp; Intégrations</CardTitle>
              <Badge variant="outline" className="text-xs">
                <IconShieldLock className="mr-1 size-3" />
                Chiffré AES-256
              </Badge>
            </div>
            <CardDescription>
              Vos clés sont chiffrées avant d&apos;être stockées. Elles ne sont jamais affichées en clair après la sauvegarde.
            </CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-6 px-6 pb-6">
            {/* Ollama */}
            <div>
              <h3 className="text-sm font-medium mb-3">Ollama (IA locale)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ollamaUrl">URL du serveur</Label>
                  <Input id="ollamaUrl" value={ollamaUrl} onChange={(e) => setOllamaUrl(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ollamaModel">Modèle</Label>
                  <Input id="ollamaModel" value={ollamaModel} onChange={(e) => setOllamaModel(e.target.value)} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Resend */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="resendKey">Clé API Resend</Label>
                {hasResendKey && <Badge variant="secondary" className="text-xs">Configurée</Badge>}
              </div>
              <Input
                id="resendKey"
                type="password"
                placeholder={hasResendKey ? "••••••••••••" : "re_xxxxxxxxxxxx"}
                value={resendKey}
                onChange={(e) => setResendKey(e.target.value)}
              />
            </div>

            {/* Apify */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="apifyToken">Token API Apify</Label>
                {hasApifyToken && <Badge variant="secondary" className="text-xs">Configuré</Badge>}
              </div>
              <Input
                id="apifyToken"
                type="password"
                placeholder={hasApifyToken ? "••••••••••••" : "apify_api_xxxxxxxxxxxx"}
                value={apifyToken}
                onChange={(e) => setApifyToken(e.target.value)}
              />
            </div>

            {/* Sentry DSN */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="sentryDsn">Sentry DSN (optionnel)</Label>
              <Input
                id="sentryDsn"
                placeholder="https://xxxx@o0.ingest.sentry.io/xxxx"
                value={sentryDsn}
                onChange={(e) => setSentryDsn(e.target.value)}
              />
            </div>

            <Separator />

            {/* Outreach Provider */}
            <div className="flex flex-col gap-2">
              <Label>Canal d&apos;expédition par défaut</Label>
              <CardDescription className="mb-1 text-xs">
                Choisissez Gmail si vous êtes connecté via Google OAuth, ou Resend pour des envois via API.
              </CardDescription>
              <Select value={preferredProvider} onValueChange={setPreferredProvider}>
                <SelectTrigger className="w-full sm:w-[280px]">
                  <SelectValue placeholder="Choisir un expéditeur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resend">Resend (API Key)</SelectItem>
                  <SelectItem value="gmail">Gmail (Google OAuth)</SelectItem>
                  <SelectItem value="auto">Automatique (Priorité Gmail)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSaveKeys} disabled={savingKeys} className="w-full sm:w-auto">
              {savingKeys ? <IconLoader2 className="mr-2 size-4 animate-spin" /> : <IconKey className="mr-2 size-4" />}
              Sauvegarder les clés API
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
