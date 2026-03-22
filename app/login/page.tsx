"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { IconEye, IconEyeOff } from "@tabler/icons-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const authError = searchParams.get("error")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        action: "login",
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou mot de passe incorrect")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError("")
    try {
      await signIn("google", { callbackUrl })
    } catch {
      setError("Erreur lors de la connexion avec Google")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FBFAF9] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-[rgba(55,50,47,0.08)]">
        <Link href="/" className="flex items-center gap-2 group">
          {/* Icon */}
          <div className="w-6 h-6 relative">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M12 2L20 20H4L12 2Z" fill="#37322F" />
            </svg>
          </div>
          <span className="text-[#37322F] text-base font-semibold leading-none">Outreach Machine</span>
        </Link>
        <div className="text-[rgba(55,50,47,0.60)] text-sm font-normal">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-[#37322F] font-medium underline underline-offset-2 hover:opacity-70 transition-opacity">
            S&apos;inscrire
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[400px] flex flex-col gap-8">
          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[#37322F] text-3xl font-semibold leading-tight tracking-tight font-sans">
              Bon retour
            </h1>
            <p className="text-[rgba(55,50,47,0.60)] text-sm font-normal leading-5">
              Connectez-vous à votre espace Outreach Machine.
            </p>
          </div>

          {/* Error display */}
          {(error || authError) && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error || (authError === "OAuthAccountNotLinked"
                ? "Ce compte est déjà lié à une autre méthode de connexion."
                : "Une erreur est survenue lors de la connexion.")}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[#37322F] text-sm font-medium leading-5"
              >
                Adresse email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  className="w-full h-10 px-3 py-2 bg-white border border-[rgba(55,50,47,0.16)] rounded-lg text-[#37322F] text-sm font-normal placeholder:text-[rgba(55,50,47,0.35)] focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F]/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[#37322F] text-sm font-medium leading-5"
                >
                  Mot de passe
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[rgba(55,50,47,0.55)] text-xs font-medium hover:text-[#37322F] transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-10 px-3 pr-10 py-2 bg-white border border-[rgba(55,50,47,0.16)] rounded-lg text-[#37322F] text-sm font-normal placeholder:text-[rgba(55,50,47,0.35)] focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(55,50,47,0.40)] hover:text-[#37322F] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full h-10 bg-[#37322F] rounded-full overflow-hidden flex items-center justify-center hover:bg-[#2A2520] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.10)] to-[rgba(0,0,0,0.10)] mix-blend-multiply pointer-events-none" />
              <span className="text-white text-sm font-medium leading-5 relative z-10">
                {loading ? "Connexion..." : "Se connecter"}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[rgba(55,50,47,0.10)]" />
            <span className="text-[rgba(55,50,47,0.40)] text-xs font-medium">ou continuer avec</span>
            <div className="flex-1 h-px bg-[rgba(55,50,47,0.10)]" />
          </div>

          {/* Social buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full h-10 bg-white border border-[rgba(55,50,47,0.14)] rounded-full flex items-center justify-center gap-2.5 hover:bg-[rgba(55,50,47,0.03)] transition-colors shadow-[0px_1px_2px_rgba(55,50,47,0.06)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-[#37322F] text-sm font-medium">
                {googleLoading ? "Connexion..." : "Google"}
              </span>
            </button>
          </div>

          {/* Footer link */}
          <p className="text-center text-[rgba(55,50,47,0.50)] text-xs leading-5">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-[#37322F] font-medium hover:opacity-70 transition-opacity underline underline-offset-2">
              Créer un compte
            </Link>
          </p>
        </div>
      </main>

      {/* Bottom brand mark */}
      <footer className="py-6 flex items-center justify-center">
        <p className="text-[rgba(55,50,47,0.30)] text-xs font-normal">
          © 2025 Outreach Machine · Uprising Studio
        </p>
      </footer>
    </div>
  )
}
