# Script de démarrage pour développement local (Windows PowerShell)
# Vérifie la présence de ollama, met en place Kimu (Qwen), vérifie Docker et installe les deps.

Write-Host "🚀 Démarrage de Outreach Machine (Dev Mode)..." -ForegroundColor Cyan

# 1. Vérification du fichier d'environnement
if (-Not (Test-Path ".env.local")) {
    Write-Host "⚠️ Attention : Fichier .env.local manquant !" -ForegroundColor Yellow
    Write-Host "Assurez-vous d'avoir configuré Supabase, Resend, Google, etc."
}

# 2. Installation automatique des dépendances
Write-Host "📦 Installation des dépendances avec pnpm..." -ForegroundColor Green
pnpm install

# 3. Configuration de Kimu (Ollama)
Write-Host "🤖 Configuration de l'IA Locale (Kimu)" -ForegroundColor Cyan
$kimuChoice = Read-Host "Voulez-vous utiliser Kimu 2.5 (1) ou Kimu 2.4.2.5 (2) ? [1/2]"
if ($kimuChoice -eq "2") {
    $model = "qwen2.5:1.5b"
    Write-Host "⬇️ Téléchargement et lancement de Kimu 2.4.2.5 ($model)..." -ForegroundColor Green
} else {
    $model = "qwen2.5"
    Write-Host "⬇️ Téléchargement et lancement de Kimu 2.5 ($model)..." -ForegroundColor Green
}
# Met à jour la variable d'environnement pour cette session
$env:OLLAMA_MODEL = $model
# On essaie de pull le modèle en background
Start-Job -ScriptBlock { param($m) ollama pull $m } -ArgumentList $model | Out-Null

try {
    $null = Get-Process ollama -ErrorAction Stop
    Write-Host "✅ Serveur Ollama détecté en cours d'exécution." -ForegroundColor Green
} catch {
    Write-Host "⚠️ Attention : Ollama n'est pas en cours d'exécution." -ForegroundColor Yellow
    Write-Host "Veuillez lancer l'application Ollama ou exécuter 'ollama serve' dans un autre terminal."
}

# 4. Lancement (Docker ou Local)
$dockerChoice = Read-Host "🐳 Voulez-vous démarrer un conteneur Docker ultra-rapide ? (O/N)"
if ($dockerChoice -match "^[OoYy]") {
    Write-Host "🏗️ Construction de l'image Docker (standalone)..." -ForegroundColor Green
    docker build -t outreach-machine:latest .
    Write-Host "🚀 Lancement du conteneur sur le port 3000..." -ForegroundColor Green
    docker run -p 3000:3000 --env-file .env.local outreach-machine:latest
} else {
    Write-Host "📦 Lancement de Next.js en mode développement sur http://localhost:3000..." -ForegroundColor Green
    pnpm dev
}
