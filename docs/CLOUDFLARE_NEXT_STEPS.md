# Prochaines Étapes : Déploiement avec Cloudflare

Pour mettre en place Cloudflare afin de sécuriser et distribuer l'application Outreach Machine, voici les prochaines étapes à suivre.

## 1. Prise en main de Cloudflare
1. Créez un compte sur [Cloudflare](https://dash.cloudflare.com/sign-up).
2. Ajoutez votre nom de domaine (ex: `uprisingstudio-mtl.com`).
3. Mettez à jour les serveurs de noms (Nameservers) chez votre registraire actuel pour pointer vers ceux fournis par Cloudflare.

## 2. Configuration des Enregistrements DNS
- Une fois le domaine actif sur Cloudflare, ajoutez vos enregistrements `A` ou `CNAME` pointant vers l'IP de votre serveur VPS ou vers votre plateforme d'hébergement Vercel/Render.
- Assurez-vous que le "nuage" orange (Proxy status: Proxied) est activé pour le domaine principal, afin de bénéficier du WAF, du CDN et du SSL de Cloudflare.

## 3. SSL / TLS et Sécurité
1. Allez dans l'onglet **SSL/TLS**. 
2. Choisissez le mode **Full (Strict)** si votre serveur d'origine a déjà un certificat SSL (recommandé), ou **Full** si vous avez un certificat auto-signé.
3. Activez **Always Use HTTPS** dans *SSL/TLS > Edge Certificates* pour rediriger le trafic HTTP vers HTTPS.

## 4. Règles WAF pour l'API Next.js
- Allez dans **Security > WAF**.
- Créez des règles pour protéger vos routes d'API (particulièrement `/api/leads` et `/api/chat/generate`).
- Vous pouvez configurer des limites de taux (*Rate Limiting*) pour empêcher les abus sur l'IA (génération d'emails) en limitant le nombre de requêtes par IP.

## 5. Caching & Performance
- Allez dans l'onglet **Caching > Configuration** et configurez le niveau de mise en cache sur *Standard*.
- Si vous hébergez sur Vercel, la majorité du CDN est déjà géré par Vercel, mais Cloudflare ajoutera une couche de sécurité supplémentaire (assurez-vous juste de ne pas faire entrer Vercel et Cloudflare en conflit sur les redirections www - configurez Cloudflare SSL sur "Full Strict").

## 6. Access (Zero Trust) pour le Dashboard (Optionnel)
- Si vous souhaitez restreindre l'accès à certaines pages (comme `/dashboard/**`) uniquement à votre équipe interne :
- Utilisez **Cloudflare Zero Trust** pour exiger une vérification par e-mail ou par One-Time PIN avant même que la page de login Next.js ne s'affiche.
