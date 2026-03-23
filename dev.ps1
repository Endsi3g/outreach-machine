# Script de demarrage pour developpement local (Windows PowerShell)
# Verifie la presence de ollama, met en place Kimu (Qwen), verifie Docker et installe les deps.

Set-Location $PSScriptRoot

Write-Host "Demarrage de Outreach Machine (Dev Mode)..." -ForegroundColor Cyan

# 1. Verification du fichier d'environnement
if (-Not (Test-Path ".env.local")) {
    Write-Host "Attention : Fichier .env.local manquant !" -ForegroundColor Yellow
    Write-Host "Assurez-vous d'avoir configure Supabase, Resend, Google, etc."
}

# 2. Installation automatique des dependances
Write-Host "Installation des dependances..." -ForegroundColor Green
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm install
} else {
    Write-Host "pnpm non detecte, utilisation de npm..." -ForegroundColor Yellow
    npm install
}

# 3. Configuration de Kimi K2-5 & Ollama Cloud
Write-Host "Configuration de l'IA Kimi K2-5" -ForegroundColor Cyan

$cloudChoice = Read-Host "Utilisez-vous une instance Ollama Cloud distante ? (O/N) [Par defaut N]"
if ($cloudChoice -match "^[OoYy]") {
    $cloudUrl = Read-Host "Entrez l'URL de votre instance Cloud (ex: http://votre-serveur:11434)"
    if ($cloudUrl) {
        $env:OLLAMA_BASE_URL = $cloudUrl
        Write-Host "Mode Cloud active vers $cloudUrl" -ForegroundColor Green
    }
}

$model = "kimi:k2-5"
Write-Host "Utilisation du modele Kimi K2-5 ($model)..." -ForegroundColor Green

$env:OLLAMA_MODEL = $model

if (-Not $env:OLLAMA_BASE_URL) {
    Start-Job -ScriptBlock { param($m) ollama pull $m } -ArgumentList $model | Out-Null
}

if (-Not $env:OLLAMA_BASE_URL) {
    try {
        $null = Get-Process ollama -ErrorAction Stop
        Write-Host "Serveur Ollama Local detecte en cours d'execution." -ForegroundColor Green
    } catch {
        Write-Host "Attention : Ollama Local n'est pas en cours d'execution." -ForegroundColor Yellow
        Write-Host "Veuillez lancer l'application Ollama ou configurer une instance Cloud."
    }
}

# 4. Lancement (Docker ou Local)
$dockerChoice = Read-Host "Voulez-vous demarrer un conteneur Docker ultra-rapide ? (O/N)"
if ($dockerChoice -match "^[OoYy]") {
    Write-Host "Construction de l'image Docker (standalone)..." -ForegroundColor Green
    docker build -t outreach-machine:latest .
    Write-Host "Lancement du conteneur sur le port 3000..." -ForegroundColor Green
    docker run -p 3000:3000 --env-file .env.local outreach-machine:latest
} else {
    Write-Host "Lancement de Next.js en mode developpement sur http://localhost:3000..." -ForegroundColor Green
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        pnpm dev
    } else {
        npm run dev
    }
}
