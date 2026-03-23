# Fonctionnalités et Composants Ajoutés (Mise à jour v3.7.1+)

Voici la liste complète des fonctionnalités implémentées, des composants créés et des fichiers modifiés lors de cette itération.

## 🛡️ Infrastructure & Configuration
- **`Dockerfile`** : Modifié pour utiliser `node:20-alpine`, réduisant drastiquement le poids de l'image Docker finale (optimisation multi-stage).
- **`app/api/health/route.ts`** *(Nouveau)* : Création d'un endpoint de monitoring permettant de vérifier instantanément et en temps réel l'état de la base de données Supabase et du service local IA Ollama.
- **`instrumentation.ts`** : Centralisation complète et propre de la configuration Sentry. Les anciens fichiers locaux (`sentry.server.config.ts`, `sentry.edge.config.ts`) ont été supprimés.

## 🤖 Intelligence Artificielle
- **`hooks/use-model-store.ts`** *(Nouveau)* : Création d'un store global Zustand (avec persistance) pour sauvegarder le choix du modèle IA de l'utilisateur.
- **`components/ui/model-selector.tsx`** *(Nouveau)* : Composant d'interface (menu déroulant) intégré dans le Header permettant de switcher dynamiquement entre `Kimi 2.5`, `Llama 3`, et `DeepSeek`.
- **`lib/agent/web-scraper.ts`** : Algorithme de recherche (Agentic Research) grandement amélioré. L'agent analyse désormais les headers HTTP (Serveur, x-powered-by), les balises `<meta generator>`, et recherche des signatures précises (Next.js, Webflow, WordPress, Svelte, etc.) pour extraire la stack technologique des prospects de façon exhaustive.
- **`components/ui/thinking-process.tsx`** *(Nouveau)* : Composant visuel rétractable développé pour intercepter les balises `<think>...</think>` générées par certains modèles poussés (comme DeepSeek) afin d'exposer de manière transparente leur processus logique ("Streaming Progress").
- **`app/api/chat/generate/route.ts`** : L'API de génération prend maintenant en charge le modèle passé par le frontend en dynamique.

## 🎨 Interface Utilisateur (UI/UX)
- **`components/page-transition.tsx`** : Refonte totale des transitions inter-pages ("View Transitions") en utilisant la librairie `framer-motion` (`AnimatePresence`) pour assurer des fondus croisés et une mise à l'échelle extrêmement fluides lors de la navigation dans le Dashboard.
- **`components/data-table.tsx`** : Correction de l'expérience mobile sur le Dashboard. Les contraintes rigides `overflow-hidden` qui cassaient l'affichage des tableaux sur smartphones ont été remplacées par un englobant `overflow-x-auto` fluide et responif.

## 📨 Marketing & Outreach
- **`components/chart-area-interactive.tsx`** : Reporting Avancé. Transformation du graphique statique en un tableau de bord calculant dynamiquement le ROI Net par campagne en fonction de l'investissement (Coût) et des Revenus générés.
- **`dev.ps1`** : Correction des anomalies d'encodage et guillemets empêchant l'exécution du script de lancement de dev de l'application.
