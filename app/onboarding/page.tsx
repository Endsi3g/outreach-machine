"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconArrowRight, IconLoader2, IconSparkles } from "@tabler/icons-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [step, setStep] = React.useState(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Form State
  const [companyName, setCompanyName] = React.useState("")
  const [industry, setIndustry] = React.useState("")
  const [website, setWebsite] = React.useState("")
  const [senderName, setSenderName] = React.useState("")
  const [senderEmail, setSenderEmail] = React.useState("")
  const [signature, setSignature] = React.useState("")

  const handleNext = () => {
    if (step === 1 && !companyName) {
      toast.error("Veuillez entrer le nom de votre entreprise")
      return
    }
    if (step === 2 && (!senderName || !senderEmail)) {
      toast.error("Veuillez renseigner vos informations d'expéditeur")
      return
    }
    setStep((s) => s + 1)
  }

  const handleFinish = async () => {
    try {
      setIsSubmitting(true)
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session?.user?.email || "anonymous",
        },
        body: JSON.stringify({
          companyName,
          industry,
          website,
          senderName,
          senderEmail,
          signature,
        }),
      })

      if (!res.ok) throw new Error("Erreur de sauvegarde")

      toast.success("Configuration terminée ! Bienvenue.")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="dark flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4 text-zinc-50 selection:bg-emerald-500/30">
      {/* Background gradients matching landing page */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0,transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative w-full max-w-lg z-10">
        <div className="mb-8 text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <IconSparkles className="h-5 w-5 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-serif mb-2">
            Configurez votre espace
          </h1>
          <p className="text-zinc-400">
            Étape {step} sur 3
          </p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="h-1 w-full bg-zinc-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 ease-in-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-white">
              {step === 1 && "Votre Entreprise"}
              {step === 2 && "Votre Identité d'Expéditeur"}
              {step === 3 && "Tout est prêt !"}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {step === 1 && "Pour des emails générés par l'IA ultra-pertinents."}
              {step === 2 && "Comment vos prospects vous verront."}
              {step === 3 && "Vérifiez vos informations avant de commencer."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {step === 1 && (
              <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid gap-2">
                  <Label htmlFor="companyName" className="text-zinc-300">Nom de l&apos;entreprise *</Label>
                  <Input
                    id="companyName"
                    placeholder="Acme Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-zinc-950/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="industry" className="text-zinc-300">Secteur d&apos;activité</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="bg-zinc-950/50 border-zinc-700 text-white focus:ring-emerald-500">
                      <SelectValue placeholder="Sélectionnez un secteur" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="saas">SaaS & Logiciel</SelectItem>
                      <SelectItem value="agency">Agence Web / Marketing</SelectItem>
                      <SelectItem value="consulting">Conseil & B2B</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website" className="text-zinc-300">Site internet</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://acme.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="bg-zinc-950/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid gap-2">
                  <Label htmlFor="senderName" className="text-zinc-300">Nom complet *</Label>
                  <Input
                    id="senderName"
                    placeholder="Jean Dupont"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="bg-zinc-950/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="senderEmail" className="text-zinc-300">Email d&apos;expédition *</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    placeholder="jean@acme.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="bg-zinc-950/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signature" className="text-zinc-300">Signature de l&apos;email</Label>
                  <Textarea
                    id="signature"
                    placeholder="Cordialement,&#13;&#10;Jean Dupont - Directeur Général"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="min-h-[100px] bg-zinc-950/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
                  <h3 className="font-semibold text-white mb-2">Résumé</h3>
                  <dl className="grid grid-cols-1 gap-2 text-sm text-zinc-300 sm:grid-cols-2">
                    <div><dt className="text-zinc-500 inline">Entreprise : </dt><dd className="inline text-white">{companyName}</dd></div>
                    <div><dt className="text-zinc-500 inline">Secteur : </dt><dd className="inline text-white">{industry || "Non défini"}</dd></div>
                    <div><dt className="text-zinc-500 inline">Expéditeur : </dt><dd className="inline text-white">{senderName}</dd></div>
                    <div><dt className="text-zinc-500 inline">Email : </dt><dd className="inline text-white">{senderEmail}</dd></div>
                  </dl>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-4 text-sm text-emerald-400 border border-emerald-500/20">
                  <p>Votre compte est configuré. L&apos;IA utilisera ces informations pour personnaliser vos futures campagnes d&apos;emails.</p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-zinc-800 pt-6">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1 || isSubmitting}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Retour
            </Button>
            {step < 3 ? (
              <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                Continuer
                <IconArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={isSubmitting} className="bg-white text-black hover:bg-zinc-200 border-0">
                {isSubmitting ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <IconSparkles className="mr-2 h-4 w-4" />
                    Accéder au Dashboard
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
