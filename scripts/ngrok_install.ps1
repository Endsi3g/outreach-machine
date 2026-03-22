# Script d'installation de ngrok pour Windows
# Télécharge et installe ngrok dans le dossier actuel

$ProgressPreference = 'SilentlyContinue'
$url = "https://bin.equinox.io/c/bPf99WDn9m9/ngrok-v3-stable-windows-amd64.zip"
$zipFile = "ngrok.zip"
$destDir = "scripts/ngrok"

Write-Host "🌐 Téléchargement de ngrok..." -ForegroundColor Cyan
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir }

Invoke-WebRequest -Uri $url -OutFile $zipFile
Expand-Archive -Path $zipFile -DestinationPath $destDir -Force
Remove-Item $zipFile

Write-Host "✅ ngrok installé avec succès dans $destDir" -ForegroundColor Green
Write-Host "👉 Pour configurer votre token : .\scripts\ngrok\ngrok.exe config add-authtoken VOTRE_TOKEN" -ForegroundColor Yellow
Write-Host "👉 Pour lancer le tunnel : .\scripts\ngrok\ngrok.exe http 3000" -ForegroundColor Green
