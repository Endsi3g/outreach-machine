# Mise à jour v3.8.0 🚀

## 🤖 Intelligence Artificielle
- **`lib/agent/lead-researcher.ts`** *(Nouveau)* : Agent de recherche profonde utilisant Exa.ai pour le sourcing et Kimi K-2.5 pour la qualification automatisée.
- **`lib/notifications/notifier.ts`** *(Nouveau)* : Système de notification hybride (Email via Resend + Telegram Bot API) pour les alertes de leads qualifiés.
- **`app/dashboard/assistant/page.tsx`** : Refonte totale pour intégrer le **Email Copilot** utilisant l'API AgentMail.to pour la gestion intelligente de la boîte de réception.


## 🛡️ Infrastructure & Scripts

- **`update.ps1`** : Correction critique de l'encodage (retrait des accents et emojis) pour assurer une compatibilité parfaite avec PowerShell 5.1 sur Windows.
- **`scripts/ngrok_install.ps1`** & **`scripts/cloudflare_install.ps1`** : Adaptations de compatibilité similaires.

## 🎨 Interface Utilisateur (UI/UX)

- **`components/lead-research-tool.tsx`** *(Nouveau)* : Outil interactif intégré au Dashboard permettant de lancer des analyses de prospects en un clic.
