# Changelog
 
## [3.7.4] - 2026-03-22
### Added
- **Optimized Loading States**: Added `loading.tsx` skeletons for all dashboard pages (Leads, Settings, Planning) for instant feedback during navigation.
- **Root Loading Screen**: Implemented a global loading UI for the initial application boot.
- **Lazy Loading**: Integrated `next/dynamic` for heavy components like `AgentPlan` and `ChartAreaInteractive` to improve page responsiveness.
 
## [3.7.3] - 2026-03-22
### Added
- **Production-Ready Auth**: Switched from in-memory mock store to persistent Supabase database for all users and profiles.
- **Gmail Outreach Integration**: Added support for sending real emails via the Gmail API for users logged in with Google OAuth.
- **Dynamic Dashboard**: `SectionCards` now fetch real-time lead counts and statistics from Supabase instead of using mock values.
- **Enhanced Settings**: New selector to choose between Gmail and Resend as the primary outreach channel.
 
## [3.7.2] - 2026-03-22
### Added
- **Sidebar News System**: Dynamic notification system integrated directly into the sidebar, pulling live updates from `CHANGELOG.md`.
- **Infrastructure**: New `lib/changelog-parser.ts` and Server Action `getChangelogNews` for zero-mock data fetching.
- **UI Components**: Implementation of `SidebarNews` (from 21st.dev) and `useMediaQuery` hook.
 
## [3.7.1] - 2026-03-22
### Fixed
- **Dependency Issues**: Resolved missing `framer-motion` requirement for `TextShimmer` and other UI components.
- **Build Conflicts**: Renamed `/api/ai` to `/api/chat` to avoid namespace collisions with the `ai` package during production builds.
- **SDK Stability**: Downgraded `ai` package to `4.1.21` to resolve `LanguageModel` type mismatches with `ollama-ai-provider`.
- **Static Generation**: Added `<Suspense>` boundaries to `/login` and `/register` pages to prevent build-time crashes caused by `useSearchParams()`.
- **Component Bug**: Fixed a `ReferenceError` in `AgentPlan` due to an undefined `status` variable.
 
### Added
- **UI Enhancements**: Integrated premium components (`TextShimmer`, `AIInputWithLoading`, `AgentPlan`) for a more interactive experience.
- **Improved Routing**: Centralized AI generation logic under the `/api/chat` namespace.

Toutes les modifications notables apportées à ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/), et ce projet adhère à [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.7.0] - 2026-03-22

### Added
- **UI Excellence Pack**: Premium components from 21st.dev (customized).
- **Agent Planning**: New dashboard page and generation-time plan visualization.
- **Text Shimmer**: Sleek loading effects for AI-generated content.
- **AI Input with Status**: Enhanced prompt input with real-time feedback.
- **Skeleton Loaders**: High-fidelity placeholders for all dashboard sections.
- **Lazy Loading**: Dynamic imports for heavy chart components to optimize performance.

### Fixed
- **Resend Build Error**: Implemented lazy initialization for the Resend client, resolving "Missing API Key" errors during static build generation.

## [3.6.0] - 2026-03-22
### Remote Access & Build Optimization
- **Docker Fix V3** : Final fix for Tailwind CSS 4 native bindings (`oxide`) in Docker by correctly configuring `pnpm` architecture and using `node:20-bookworm-slim`.
- **Remote Access Tools** : Added automated installation scripts for `ngrok` and `Cloudflare Tunnel` (`scripts/ngrok_install.ps1`, `scripts/cloudflare_install.ps1`).
- **New Documentation** : Creation of `docs/REMOTE_ACCESS.md`, a complete step-by-step guide for setting up external access to the local instance.

## [3.5.1] - 2026-03-22
### Build & Branding Consistency
- **Docker Fix** : Transitioned to `node:20-bookworm-slim` and optimized `pnpm` configuration to resolve native binding issues with Tailwind CSS 4 (`oxide`).
- **Branding Consistency** : Unified all AI references to **Kimu 2.5** (Ollama) across the landing page, FAQ, Hero, and Documentation sections, replacing outdated "Claude" mentions.
- **Settings Defaults** : Updated default AI model to `kimi:k2-5` in the dashboard settings to match the project's local AI strategy.

## [3.5.0] - 2026-03-22
### Collaboration, Performance & Outline Builder
- **Performance Stratosphérique** : Ajout d'un `loading.tsx` global et de **Skeletons** haute fidélité. Le dashboard s'affiche instantanément sans flash blanc.
- **Outline Builder (New)** : Implémentation du constructeur d'outline premium avec onglets dynamiques et colonnes personnalisables, basé sur les maquettes fournies.
- **Système d'Équipe Complet** : Refonte de la page Équipe avec gestion des invitations (Accepter/Refuser) et visualisation des rôles.
- **Notifications Debug** : Ajout de logs de diagnostic et de vérifications de configuration pour Supabase Realtime dans la console.

## [3.4.0] - 2026-03-22
### Dashboard Automation & Metrics
- **Performance** : Suppression des redondances de polices dans `layout.tsx`, améliorant le LCP et le temps de réponse global.
- **Notifications Temps Réel** : Connexion du `NotificationsPanel` à Supabase Realtime via `/api/notifications`. Les alertes s'affichent instantanément sans rafraîchissement.
- **Analytiques Dashboard** : Création d'une page complète avec **Recharts** visualisant le volume d'envoi quotidien et la répartition des statuts (Ouvert, Erreur, etc.).
- **Automatisation Outreach** : Le bouton "Lancer l'automatisation" effectue désormais de réels envois via l'API Resend et suit l'état (Badge `Envoyé`, `Erreur`, `Lu`).

## [3.3.1] - 2026-03-22
### Hotfix: AI SDK Build Error
- **Correction de l'Erreur de Compilation** : Installation de `@ai-sdk/react` et mise à jour des imports dans `app/dashboard/generate/page.tsx` pour refléter les changements de structure du Vercel AI SDK v4+ (séparation du core et des hooks React).
- **Compatibilité Flux API** : Migration de `toDataStreamResponse()` vers `toTextStreamResponse()` dans l'API de génération pour assurer une compatibilité optimale avec le hook `useCompletion`.

## [3.3.0] - 2026-03-22
### UI/UX Premium Polish
- **Accents Français Corrigés** : Tous les accents manquants ont été ajoutés dans le pricing, les témoignages, le bento grid, et les pages login/register.
- **Hero Animations** : Entrée animée du titre (fadeInUp), sous-titre (délai), et bouton CTA (scaleIn + pulse subtil) avec des keyframes CSS pures.
- **Pricing ⭐ Badge Populaire** : Le plan Professionnel a désormais un badge doré "⭐ Populaire", une bordure accent, et un badge "Économisez 20%" en vert sur le tarif annuel.
- **Témoignages Améliorés** : Ajout d'étoiles de rating ⭐⭐⭐⭐⭐ et de dots de navigation cliquables sous le carousel.
- **Toggle Mot de Passe** : Icône œil show/hide sur les pages de connexion et d'inscription.
- **CTA Arrows** : Flèche → ajoutée aux boutons principaux (Hero + CTA section).
- **Texte Traduit** : "per month/year, per user" → "par mois/an, par utilisateur" dans le pricing.

## [3.2.0] - 2026-03-22
### Correctifs Majeurs
- **Navigation Dashboard Réparée** : Les éléments de la barre latérale (Leads, Générer, Réviser, Campagnes, Analytiques, Équipe, Paramètres) sont désormais cliquables et naviguent correctement grâce à l'intégration de `next/link` avec `asChild` dans `nav-main.tsx`.
- **Page "Mot de passe oublié"** : Création de `/forgot-password` avec un formulaire de réinitialisation fonctionnel.
- **Page "Politique de confidentialité"** : Création de `/privacy` — le lien dans le formulaire d'inscription ne génère plus de 404.
- Mise à niveau de `nav-secondary.tsx` vers `next/link` pour une navigation client-side optimale.

## [3.1.2] - 2026-03-22
### Correctifs d'interface et d'Expérience Utilisateur
- **Correction des Redirections Auth** : Les utilisateurs qui s'inscrivent ou se connectent avec succès sont désormais automatiquement propulsés vers `/dashboard` plutôt que de rester sur la page d'accueil d'acquisition.
- **Réglage Précis du Hero** : Le sous-titre de la section Hero a été cassé sur 3 lignes pour strictement correspondre aux indications visuelles de la maquette originale London.
- Maintien du patch de secours sur `NEXTAUTH_SECRET` pour le developpement et correction du composant `FooterSection` (`Import Link`).

## [3.1.0] - 2026-03-22
### Ajouts et Propriétés Étendues
- **Kimi K2-5 Cloud support** : Configuration de `OLLAMA_MODEL` vers `kimi:k2-5` par défaut.
- Ajout d'une configuration **Ollama Cloud** dans le script de l'expérience développeur (`dev.ps1`) permettant d'indiquer l'URL de son choix si l'IA locale n'est pas utilisée.
- **Playwright Fallback** : Le `webScraperTool` possède dorénavant la capacité de lancer en secours (fallback) une session Chrome Headless via Playwright lorsque des Single Page Applications (SPA) bloquent le fetch standard ou renvoient trop peu de texte, ou pour contourner Cloudflare.

### Améliorations Internes
- L'outil de web scraping prend désormais moins de risques de renvoyer du vide lorsqu'un rendu JS est requis pour le prospect analysé.

## [3.0.0] - 2026-03-21
### Majeur (Mise à Jour "London")
- Refonte complète de l'esthétique du Dashboard vers un thème "London" blanc cassé et brun riche. Les couleurs sombres ont été désignées comme obsolètes pour adopter une vue Premium pure et corporative.
- **Intégration Totale Google Suite** via OAuth : Accès direct automatisé à l'envoi d'e-mail (token efficient) et lecture Google Analytics.
- **Dockerisation Standalone** de l'application via conteneur très léger Alpine Node.js.
- Refonte complète de `README.md` et de `dev.ps1` pour fluidifier le déploiement sur tout poste de travail.
- Ajout de 3 structures marketing psychologiques.
