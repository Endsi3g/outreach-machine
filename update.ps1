# Script de mise a jour pour Outreach Machine
# Ce script tire les derniers changements du repo, installe les dependances et verifie le build.

# Se placer dans le dossier du script
Set-Location $PSScriptRoot

Write-Host "Mise a jour de Outreach Machine..." -ForegroundColor Cyan

# 1. Mise à jour via Git
if (Test-Path ".git") {
    Write-Host "Recuperation des derniers changements depuis Git..." -ForegroundColor Green
    git pull
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erreur lors du git pull." -ForegroundColor Red
        exit $LASTEXITCODE
    }
} else {
    Write-Host "Pas de dossier .git detecte, saut de l'etape git pull." -ForegroundColor Yellow
}

# 2. Installation des dépendances
Write-Host "Mise a jour des dependances avec pnpm..." -ForegroundColor Green
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur lors de l'installation des dependances." -ForegroundColor Red
    exit $LASTEXITCODE
}

# 3. Message de fin
Write-Host "Mise a jour terminee avec succes !" -ForegroundColor Green
Write-Host "Vous pouvez maintenant lancer le serveur avec .\dev.ps1" -ForegroundColor Cyan
