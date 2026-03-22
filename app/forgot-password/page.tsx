"use client"

import { useState } from "react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder — will integrate with real reset flow later
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#FBFAF9] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-[rgba(55,50,47,0.08)]">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 relative">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M12 2L20 20H4L12 2Z" fill="#37322F" />
            </svg>
          </div>
          <span className="text-[#37322F] text-base font-semibold leading-none">Outreach Machine</span>
        </Link>
        <Link href="/login" className="text-[#37322F] text-sm font-medium underline underline-offset-2 hover:opacity-70 transition-opacity">
          Retour à la connexion
        </Link>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[400px] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#37322F] text-3xl font-semibold leading-tight tracking-tight font-sans">
              Mot de passe oublié
            </h1>
            <p className="text-[rgba(55,50,47,0.60)] text-sm font-normal leading-5">
              Entrez votre adresse email pour recevoir un lien de réinitialisation.
            </p>
          </div>

          {submitted ? (
            <div className="px-4 py-6 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm text-center space-y-2">
              <p className="font-medium">Email envoyé !</p>
              <p>Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous recevrez un lien de réinitialisation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[#37322F] text-sm font-medium leading-5">
                  Adresse email
                </label>
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
              <button
                type="submit"
                className="relative w-full h-10 bg-[#37322F] rounded-full overflow-hidden flex items-center justify-center hover:bg-[#2A2520] transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.10)] to-[rgba(0,0,0,0.10)] mix-blend-multiply pointer-events-none" />
                <span className="text-white text-sm font-medium leading-5 relative z-10">
                  Envoyer le lien
                </span>
              </button>
            </form>
          )}

          <p className="text-center text-[rgba(55,50,47,0.50)] text-xs leading-5">
            <Link href="/login" className="text-[#37322F] font-medium hover:opacity-70 transition-opacity underline underline-offset-2">
              Retour à la connexion
            </Link>
          </p>
        </div>
      </main>

      <footer className="py-6 flex items-center justify-center">
        <p className="text-[rgba(55,50,47,0.30)] text-xs font-normal">
          © 2025 Outreach Machine · Uprising Studio
        </p>
      </footer>
    </div>
  )
}
