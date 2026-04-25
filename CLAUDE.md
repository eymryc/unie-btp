# UNIE BTP — Plateforme Intelligence Marchés BTP

## Présentation du projet

Plateforme digitale pour l'association **UNIE BTP** (67 entreprises membres, Côte d'Ivoire). Elle transforme les appels d'offres BTP internationaux (BAD, Banque Mondiale, AFD) en opportunités exploitables pour des PME locales : veille structurée, fiches simplifiées, mise en relation pour groupements, suivi des soumissions, gestion des cotisations.

Cabinet porteur : **MICENY** (Abidjan). Spécification complète dans le cahier des charges PDF du projet.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + TypeScript 5 |
| Style | Tailwind CSS v4 + CSS variables custom |
| 3D | @react-three/fiber + @react-three/drei + three.js |
| Formulaires | react-hook-form 7 + zod 4 |
| Dev | `npm run dev` → localhost:3000 |
| Build | `npm run build` |
| Lint | `npm run lint` (eslint-config-next) |

---

## Design system

### Palette de couleurs

```css
/* Surfaces sombres (hero, nav, sections dark) */
--night:   #070b14
--night-2: #0b1224
--night-3: #111b33

/* Texte et structure */
--ink:   #0f172a   /* texte principal */
--ink-2: #1e293b
--ink-3: #334155

/* Fond clair (body, sections light) */
--bg:        #e2e8f2
--surface:   #ffffff
--surface-2: #f6f8fc

/* Brand orange */
--primary:       #ed6120
--primary-hover: #ff7a3a
--primary-soft:  #fff1ea

/* Alias legacy */
--gold: var(--primary)        /* utiliser --primary de préférence */
--navy: #0a1628
```

### Typographie

- **Display/titres** : `Cormorant Garamond` (serif, élégant) → `font-['Cormorant_Garamond']`
- **Corps/UI** : `DM Sans` (sans-serif) → `font-['DM_Sans']` ou `font-family: var(--font-sans)`
- **Accents/chiffres** : `Bebas Neue` (condensed) → `font-['Bebas_Neue']`

### Classes utilitaires globales

```css
.btn-gold     /* bouton orange primaire avec hover scaleX */
.btn-outline  /* bouton outline blanc semi-transparent */
.reveal / .reveal-left / .reveal-right  /* animations scroll (IntersectionObserver) */
.stagger > *  /* transition-delay en cascade sur 6 enfants */
```

### Animations keyframes

- `fadeUp` : entrée du bas vers le haut
- `fadeIn` : apparition simple
- `floatY` : flottement vertical doux (badge Hero)

---

## Architecture du code

```
src/
├── app/
│   ├── layout.tsx        # Metadata SEO, fonts Google, JSON-LD schema.org
│   ├── page.tsx          # Page principale (SPA one-page, "use client")
│   ├── globals.css       # Variables CSS, classes utilitaires globales
│   └── not-found.tsx     # Page 404
└── components/
    ├── Navbar.tsx         # Nav fixe, scroll-aware, mobile hamburger
    ├── Hero.tsx           # Section hero avec BTPBlueprint3D
    ├── BTPBlueprint3D.tsx # Canvas Three.js (blueprint architectural)
    ├── BTPBlueprint3DCanvas.tsx
    ├── About.tsx          # Section "À propos"
    ├── Stats.tsx          # Compteurs animés
    ├── Services.tsx       # Axes d'intervention
    ├── Partners.tsx       # Partenaires / bailleurs
    ├── Portfolio.tsx      # Références projets membres
    ├── Events.tsx         # Événements association
    ├── Testimonials.tsx   # Témoignages membres
    ├── FAQ.tsx            # Questions fréquentes
    ├── Contact.tsx        # Formulaire de contact
    ├── Footer.tsx         # Pied de page
    └── RegisterModal.tsx  # Modal adhésion 3 étapes (zod + react-hook-form)
```

### Pattern de la page principale

`page.tsx` est `"use client"` et gère un état `modalOpen` partagé. Le `RegisterModal` est monté une fois et toutes les sections reçoivent `onOpenModal` comme prop pour déclencher l'ouverture.

### Convention composants

- `interface Props { onOpenModal?: () => void }` pour les sections qui ont un CTA adhésion
- Animations CSS inline avec `style={{ opacity:0, animation:"fadeUp .8s ease Xs forwards" }}`
- Scroll smooth via `document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })`

---

## RegisterModal — détail

Modal d'adhésion en 3 étapes avec `react-hook-form` + `zodResolver` :

| Étape | Données | Schema |
|---|---|---|
| 1 — Entreprise | companyName, registrationNumber, taxId, sector, foundingDate | `step1Schema` |
| 2 — Contact | companyEmail, phone, website, address, city, country | `step2Schema` |
| 3 — Compte | ceoName, ceoEmail, ceoPhone, password, confirmPassword | `step3Schema` |

État accumulé dans `data: Partial<Step1 & Step2 & Step3>`. Submit final = simulation API (setTimeout 1800ms) → écran succès. Pas encore connecté à un backend.

---

## Fonctionnement actuel vs. cible (cahier des charges)

### Phase actuelle — Site vitrine (MVP landing)
Site one-page institutionnel avec formulaire d'adhésion front-only. Objectif : présenter l'association et collecter les demandes de membres.

### Architecture cible complète (11 modules)

| Module | Périmètre |
|---|---|
| A — Veille stratégique | Scraping BAD / BM / AFD / DMP, base centralisée |
| B — Analyse et qualification | Décryptage critères, scoring complexité, positionnement |
| C — Structuration livrables | Fiches standardisées, tableau hebdomadaire, guides |
| D — Diffusion et activation | Alertes email / SMS / WhatsApp, actions membre |
| E — Collaboration et groupements | Mise en relation, fils de discussion, consortiums |
| F — Accompagnement | Checklists, modèles, formation BAD/BM/AFD |
| G — Gestion membres et profils | CRUD entreprises, documents, secteurs, capacités |
| H — Paiement et adhésions | Mobile money (Orange/MTN/Wave), carte, virement |
| I — Dashboard | KPIs membre et admin, opportunités recommandées |
| J — Reporting et statistiques | Rapports PDF mensuels, suivi soumissions/résultats |
| K — Analytics / SEO | Google Analytics, Facebook Pixel, SEO technique |

### Trois rôles utilisateurs
- **Visiteur** : landing public, aperçu limité opportunités, formulaire adhésion
- **Membre** : accès complet conditionné au statut cotisation "actif"
- **Administrateur** : gestion plateforme, publication opportunités, reporting

### Statuts d'abonnement
`actif` → accès complet | `en_attente` → accès limité | `expiré` → suspendu automatiquement

---

## Règles métier fondamentales (à respecter dans le code)

- La plateforme **ne fait pas** d'attribution de marchés, n'est pas une marketplace, n'est pas un réseau social
- L'accès complet est **strictement conditionné** au paiement de la cotisation
- L'administrateur est **neutre** — aucune sélection d'entreprises, aucune participation aux appels d'offres
- Toutes les actions membres sont **volontaires**

---

## Phasage prévu

| Phase | Objectif | Durée estimée |
|---|---|---|
| 1 — MVP | Site vitrine + adhésion (en cours) | 3–4 semaines |
| 2 — Enrichissement | Plateforme membre, auth, opportunités, paiements, dashboard | 1–2 mois après Phase 1 |
| 3 — Maturité | Scraping automatisé, scoring IA, mobile PWA | 3–6 mois après Phase 2 |

---

## Contexte déploiement

- Cible : Côte d'Ivoire (Abidjan), audience PME BTP, connectivité variable → performance mobile critique
- Langues : français uniquement
- SEO cible : "appels d'offres BTP Côte d'Ivoire", "marchés publics Afrique", "BAD BM AFD Côte d'Ivoire"
- Paiement Afrique de l'Ouest : Orange Money, MTN Mobile Money, Wave (prioritaires sur carte VISA)
- Notifications : email + SMS + WhatsApp (canaux Côte d'Ivoire)

---

## Commandes utiles

```bash
npm run dev      # serveur local http://localhost:3000
npm run build    # build production
npm run lint     # vérification ESLint
```
