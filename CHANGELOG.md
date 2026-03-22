# Changelog

Toutes les modifications notables apportées à ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/), et ce projet adhère à [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
