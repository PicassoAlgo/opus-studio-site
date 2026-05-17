# Opus Studio — Site vitrine (`studio.opus-ia.ch`)

Site web vitrine d'Opus Studio (création de sites web premium pour PME suisses).
Multi-pages, HTML/CSS/JS vanilla, charter Avdyl preset `tech-epure`, GSAP 3.13.

> Livré le **2026-05-17** dans le cadre du Sprint E de la roadmap post-S4.
> V1.1 (audit a11y / og:image / hébergeur déclaré) livrée le **2026-05-20**.

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
├── assets/
│   └── og.svg                       # Carte de partage social 1200×630 (Open Graph + Twitter)
├── CNAME                            # studio.opus-ia.ch (custom domain GitHub Pages)
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
- Skip-link a11y (WCAG 2.4.1) + landmark `<main>` sur les 7 pages

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

## Déploiement (GitHub Pages — LIVE depuis 17 mai 2026)

Le site est servi en statique par **GitHub Pages** depuis le repo dédié
[`PicassoAlgo/opus-studio-site`](https://github.com/PicassoAlgo/opus-studio-site)
(public). Custom domain `studio.opus-ia.ch` configuré via CNAME Infomaniak.

### Modifier + redéployer (workflow normal)

1. Éditer les fichiers HTML / CSS / JS dans ce dossier local.
2. Tester localement : `python3 -m http.server 8080` puis `http://localhost:8080`.
3. Push sur la branche `main` du repo `PicassoAlgo/opus-studio-site`.
4. GitHub Pages rebuild auto (~10-30 s) — site live à `https://studio.opus-ia.ch/`.

### Re-trigger build manuellement (si besoin)

```bash
gh api -X POST repos/PicassoAlgo/opus-studio-site/pages/builds
gh api repos/PicassoAlgo/opus-studio-site/pages/builds/latest --jq '.status'
```

### Activer `https_enforced` (à faire UNE FOIS le cert Let's Encrypt prêt)

```bash
gh api -X PUT repos/PicassoAlgo/opus-studio-site/pages -F https_enforced=true
```

Si l'API retourne « certificate does not exist yet », attendre encore 30 min – 24 h.
GitHub provisionne le certificat asynchrone après la propagation DNS.

### Vérifier l'état HTTPS

```bash
curl -sI https://studio.opus-ia.ch/ | head -5
```

`HTTP/2 200` = OK. `SSL: no alternative certificate subject name` = cert pas encore prêt.

---

## TODO post-V1.1 (optionnels)

- [ ] **Vraie photo Avdyl** dans la section « Avdyl Bytyqi » de `contact.html`
- [ ] **Vraies captures d'écran** des 4 sites livrés (remplacer Unsplash dans `realisations.html`)
- [ ] **Favicon + apple-touch-icon** : à dropper dans `assets/`
- [ ] **Image hero** custom (mockup d'écran ou photo Avdyl au bureau)
- [ ] **Form backend** : remplacer le `mailto:` par un endpoint serverless ou un service tiers EU (Formspree EU, Tally…) pour récupérer les leads sans dépendre du client mail
- [ ] **Plausible Analytics** ou équivalent EU-respectueux (optionnel)

---

## Crédits

- Conception, design, code : **Avdyl Bytyqi** (Opus Studio) avec l'assistance de Claude Code.
- Hébergement : GitHub Pages (GitHub Inc. / Microsoft Corp.) + DNS Infomaniak.
- Images placeholder : [Unsplash](https://unsplash.com) (licence libre).
- Polices : Google Fonts `Space Grotesk` + `Inter`.
- Bibliothèques : GSAP 3.13 (licence club GreenSock — gratuit pour usage interne).
