# Opus Studio — Site vitrine (`studio.opus-ia.ch`)

Site web vitrine d'Opus Studio (création de sites web premium pour PME suisses).
Multi-pages, HTML/CSS/JS vanilla, charter Avdyl preset `tech-epure`, GSAP 3.13.

> Livré le **2026-05-17** dans le cadre du Sprint E de la roadmap post-S4 (cf
> `~/Dev/opus/RECAP_SESSION.md`).

---

## Structure des fichiers

```
opus-studio/
├── index.html                       # Landing (hero + 3 piliers + services + portfolio + process + témoignages + FAQ + contact)
├── services.html                    # Détail des 3 formules (Essentiel / Premium / Sérénité)
├── tarifs.html                      # Grille tarifaire + modalités paiement + FAQ tarifs
├── realisations.html                # Portfolio 4 sites livrés (La Forge, TOFAJ, Natursteine Wüst, Module SA)
├── contact.html                     # Coordonnées + formulaire mailto + adresse Romont
├── mentions-legales.html            # Mentions légales + CGV (droit suisse, juridiction Fribourg)
├── politique-confidentialite.html   # Conforme nLPD + RGPD (pas de cookies de tracking)
├── style.css                        # Preset tech-epure (charter Avdyl §3.2)
├── script.js                        # GSAP timeline immédiat hero + ScrollTrigger reveals
├── robots.txt
├── sitemap.xml
└── README.md (ce fichier)
```

**9 pages HTML** · `style.css` partagé · `script.js` partagé · GSAP via CDN (zéro build, zéro dépendance npm).

---

## Stack technique (charter Avdyl)

- HTML/CSS/JS vanilla, **pas de framework**, **pas de build step**
- GSAP **3.13** via cdnjs (`gsap.min.js` + `ScrollTrigger.min.js` + `SplitText.min.js`)
- **PAS de Lenis** (bug iOS 17+ confirmé — scroll natif)
- Google Fonts `Space Grotesk` + `Inter` via `<link>` `display=swap`
- Hero animé via `gsap.timeline()` immédiat (jamais ScrollTrigger sur le hero)
- Fallback CSS `[data-anim]{opacity:1}` (si JS crash, tout reste visible)
- `prefers-reduced-motion` respecté
- Lighthouse cible : Performance ≥ 90, A11y = 100, SEO = 100
- Menu burger natif < 900px, sticky mobile CTA

---

## Grille tarifaire (verrouillée 2026-05-17)

| Offre | Prix | Modalité |
|---|---|---|
| **Essentiel** | 890 CHF | 2× (445 + 445) — validation maquette + livraison |
| **Premium** | 1'990 CHF | 2× (995 + 995) — validation maquette + livraison |
| **Sérénité Standard** | 32 CHF/mois (390/an) | maintenance + hébergement + 1 modif/mois |
| **Sérénité Pro** | 74 CHF/mois (890/an) | + 3 modifs/mois + monitoring + upgrade annuel |
| **Marketing IA** | 290 CHF/mois | « Bientôt » (en préparation) |

---

## ⚠️ Actions humaines pour mise en ligne

### 1. Créer le sous-domaine DNS `studio.opus-ia.ch`

Côté Infomaniak (manager de `opus-ia.ch`) :
- Ajouter un enregistrement **CNAME** pour `studio` → `apex-loadbalancer.netlify.com.`
- (Alternative A record si Netlify Apex : `75.2.60.5`)
- Propagation DNS : 1-30 min en pratique.

### 2. Créer la mailbox `studio@opus-ia.ch`

Côté Infomaniak Service Mail :
- Créer une boîte `studio@opus-ia.ch` (ou un alias vers `contact@opus-ia.ch`).
- Vérifier que les formulaires `mailto:studio@opus-ia.ch` arrivent bien.

### 3. Déployer sur Netlify

**Option A — drag & drop** (le plus simple pour la 1<sup>re</sup> mise en ligne) :
1. Ouvrir [app.netlify.com](https://app.netlify.com) → bouton « Add new site » → « Deploy manually ».
2. Zipper le dossier `opus-studio/` (ou drag & drop directement).
3. Netlify donne une URL temporaire `*.netlify.app` — vérifier que tout marche.
4. Settings → Domain management → ajouter le custom domain `studio.opus-ia.ch`.
5. Activer le HTTPS Let's Encrypt automatique (Netlify le propose dès que le DNS pointe correctement).

**Option B — GitHub auto-deploy** (recommandé si tu pousses déjà sur `PicassoAlgo/opus-ia-v2`) :
1. Sur Netlify → « Add new site » → « Import from Git ».
2. Connecter le repo `PicassoAlgo/opus-ia-v2`.
3. Build settings :
   - Build command : *(laisser vide)*
   - Publish directory : `sites-clients/opus-studio`
4. Chaque push sur `main` redéploie automatiquement.

### 4. Tester avant communication

- [ ] `studio.opus-ia.ch` charge sans erreur en HTTPS
- [ ] Les 4 onglets nav (Services / Réalisations / Tarifs / Contact) fonctionnent
- [ ] Le formulaire de contact ouvre bien le client mail vers `studio@opus-ia.ch`
- [ ] Test mobile (iPhone) : hero visible, burger menu fonctionne, sticky CTA OK
- [ ] Lighthouse > 90 sur les 4 axes (lancer un audit en navigation privée)
- [ ] Test `prefers-reduced-motion` (System Preferences → Accessibility) → animations désactivées

---

## TODO post-livraison V1 (optionnels)

- [ ] **Vraie photo Avdyl** dans la section « Avdyl Bytyqi » de `contact.html` (actuellement pas d'image, sobre)
- [ ] **Vraies captures d'écran** des 4 sites livrés en remplacement des Unsplash (`realisations.html`)
- [ ] **og:image** dédiée (1200×630px) — actuellement pas d'image OG
- [ ] **Favicon + apple-touch-icon** : à dropper dans `assets/`
- [ ] **Image hero** custom (un mockup d'écran ou photo Avdyl au bureau) — actuellement gradient + grille seule
- [ ] **Form backend** : remplacer le `mailto:` par Netlify Forms (gratuit, 100 submissions/mois) pour récupérer les leads sans dépendre du client mail
- [ ] **Plausible Analytics** ou équivalent EU-respectueux (optionnel)

---

## Pour modifier le site

1. Éditer directement les fichiers HTML / CSS / JS — pas de compilation.
2. Tester en local : `python3 -m http.server 8080` dans le dossier `opus-studio/`, puis `http://localhost:8080`.
3. Push sur la branche `main` du repo → Netlify redéploie automatiquement (si Option B activée).

Les fichiers étant statiques, le déploiement prend généralement < 30 secondes.

---

## Crédits

- Conception, design, code : **Avdyl Bytyqi** (Opus Studio) avec l'assistance de Claude Code.
- Images placeholder : [Unsplash](https://unsplash.com) (licence libre).
- Polices : Google Fonts `Space Grotesk` + `Inter`.
- Bibliothèques : GSAP 3.13 (licence club GreenSock — gratuit pour usage interne).
