# Script de mise à jour pour Outreach Machine
# Ce script tire les derniers changements du repo, installe les dépendances et vérifie le build.

# Se placer dans le dossier du script
Set-Location $PSScriptRoot

Write-Host "🔄 Mise à jour de Outreach Machine..." -ForegroundColor Cyan

# 1. Mise à jour via Git
if (Test-Path ".git") {
    Write-Host "📥 Récupération des derniers changements depuis Git..." -ForegroundColor Green
    git pull
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors du git pull." -ForegroundColor Red
        exit $LASTEXITCODE
    }
} else {
    Write-Host "ℹ️ Pas de dossier .git détecté, saut de l'étape git pull." -ForegroundColor Yellow
}

# 2. Installation des dépendances
Write-Host "📦 Mise à jour des dépendances avec pnpm..." -ForegroundColor Green
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances." -ForegroundColor Red
    exit $LASTEXITCODE
}

# 3. Message de fin
Write-Host "✨ Mise à jour terminée avec succès !" -ForegroundColor Green
Write-Host "🚀 Vous pouvez maintenant lancer le serveur avec .\dev.ps1" -ForegroundColor Cyan
