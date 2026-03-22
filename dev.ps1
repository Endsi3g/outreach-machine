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

# 3. Configuration de Kimi K2-5 & Ollama Cloud
Write-Host "🤖 Configuration de l'IA Kimi K2-5" -ForegroundColor Cyan

$cloudChoice = Read-Host "Utilisez-vous une instance Ollama Cloud distante ? (O/N) [Par défaut N]"
if ($cloudChoice -match "^[OoYy]") {
    $cloudUrl = Read-Host "Entrez l'URL de votre instance Cloud (ex: http://votre-serveur:11434)"
    if ($cloudUrl) {
        $env:OLLAMA_BASE_URL = $cloudUrl
        Write-Host "🌐 Mode Cloud activé vers $cloudUrl" -ForegroundColor Green
    }
}

$model = "kimi:k2-5"
Write-Host "⬇️ Utilisation du modèle Kimi K2-5 ($model)..." -ForegroundColor Green

# Met à jour la variable d'environnement pour cette session
$env:OLLAMA_MODEL = $model

# On essaie de pull le modèle de façon asynchrone (utile si on est en local)
if (-Not $env:OLLAMA_BASE_URL) {
    Start-Job -ScriptBlock { param($m) ollama pull $m } -ArgumentList $model | Out-Null
}

if (-Not $env:OLLAMA_BASE_URL) {
    try {
        $null = Get-Process ollama -ErrorAction Stop
        Write-Host "✅ Serveur Ollama Local détecté en cours d'exécution." -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Attention : Ollama Local n'est pas en cours d'exécution." -ForegroundColor Yellow
        Write-Host "Veuillez lancer l'application Ollama ou configurer une instance Cloud."
    }
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
