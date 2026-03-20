# Script de démarrage pour développement local (Windows PowerShell)
# Vérifie la présence de ollama et lance le serveur Next.js

Write-Host "🚀 Démarrage de Outreach Machine (Dev Mode)..." -ForegroundColor Cyan

# 1. Vérification du fichier d'environnement
if (-Not (Test-Path ".env.local")) {
    Write-Host "⚠️ Attention : Fichier .env.local manquant !" -ForegroundColor Yellow
    Write-Host "Assurez-vous d'avoir configuré Supabase, Resend, etc."
}

# 2. Vérification d'Ollama
try {
    $ollamaProcess = Get-Process ollama -ErrorAction Stop
    Write-Host "✅ Serveur Ollama détecté en cours d'exécution." -ForegroundColor Green
} catch {
    Write-Host "⚠️ Attention : Ollama n'est pas en cours d'exécution." -ForegroundColor Yellow
    Write-Host "Veuillez lancer l'application Ollama ou exécuter 'ollama serve' dans un autre terminal pour la génération d'emails IA."
}

# 3. Lancement de Next.js
Write-Host "📦 Lancement de Next.js sur http://localhost:3000..." -ForegroundColor Green
pnpm dev
