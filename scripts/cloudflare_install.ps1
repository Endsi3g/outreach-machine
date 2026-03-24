# Script d'installation de Cloudflare Tunnel (cloudflared) pour Windows
# Telecharge et installe cloudflared dans le dossier actuel

$ProgressPreference = 'SilentlyContinue'
$url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
$destFile = "scripts/cloudflared.exe"

Write-Host "Telechargement de Cloudflare Tunnel (cloudflared)..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $url -OutFile $destFile

Write-Host "cloudflared installe avec succes dans $destFile" -ForegroundColor Green
Write-Host "👉 Pour vous connecter : .\scripts\cloudflared.exe tunnel login" -ForegroundColor Yellow
Write-Host "👉 Pour lancer un tunnel rapide : .\scripts\cloudflared.exe tunnel --url http://localhost:3000" -ForegroundColor Green
