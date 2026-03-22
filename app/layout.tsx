import type React from "react"
import type { Metadata } from "next"
import { Inter, Instrument_Serif } from "next/font/google"
import { AuthProvider } from "@/components/auth-provider"
import { SmoothScroll } from "@/components/smooth-scroll"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Outreach Machine - Automatisation d'emails a froid intelligente",
  description:
    "Importez vos leads, generez des emails ultra-personnalises avec l'IA Claude, validez et envoyez via Brevo. Construit pour Uprising Studio.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${instrumentSerif.variable} antialiased`}>
      <head />
      <body className="font-sans antialiased">
        <SmoothScroll />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
