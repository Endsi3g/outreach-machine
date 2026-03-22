# Guide d'Accès Distant (Remote Access)

Ce document explique comment rendre votre instance locale de **Outreach Machine** accessible depuis Internet en utilisant `ngrok` ou `Cloudflare Tunnel`.

## 1. Utilisation de ngrok

`ngrok` est l'outil le plus simple pour exposer rapidement un port local.

### Installation
Lancez le script d'installation PowerShell :
```powershell
.\scripts\ngrok_install.ps1
```

### Configuration
1. Créez un compte sur [ngrok.com](https://ngrok.com).
2. Récupérez votre `Authtoken`.
3. Configurez-le localement :
   ```powershell
   .\scripts\ngrok\ngrok.exe config add-authtoken VOTRE_TOKEN
   ```

### Lancement
Pour exposer l'application (port 3000) :
```powershell
.\scripts\ngrok\ngrok.exe http 3000
```
Copiez l'URL `https://xxxx.ngrok-free.app` fournie dans le terminal.

---

## 2. Utilisation de Cloudflare Tunnel

`Cloudflare Tunnel` est une alternative plus robuste et gratuite (pour les fonctionnalités de base) qui ne nécessite pas d'ouvrir de ports sur votre box.

### Installation
Lancez le script d'installation PowerShell :
```powershell
.\scripts\cloudflare_install.ps1
```

### Mode Rapide (Quick Tunnel)
Pour générer une URL temporaire sans compte Cloudflare :
```powershell
.\scripts\cloudflared.exe tunnel --url http://localhost:3000
```

### Mode Persistant (Recommandé)
1. Connectez-vous à votre compte Cloudflare :
   ```powershell
   .\scripts\cloudflared.exe tunnel login
   ```
2. Créez un tunnel :
   ```powershell
   .\scripts\cloudflared.exe tunnel create outreach-machine
   ```
3. Configurez le routage vers votre domaine dans le dashboard Cloudflare Zero Trust.

---

## Pourquoi utiliser ces outils ?
- **Webhooks** : Indispensable si vous intégrez des services tiers qui doivent envoyer des données à votre app (ex: Stripe, Resend).
- **Démos** : Partagez votre travail en cours avec vos clients ou collaborateurs instantanément.
- **Test Mobile** : Accédez à l'app depuis votre smartphone sur le même réseau ou en 4G.
