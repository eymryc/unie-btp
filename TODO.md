# UNIE BTP — Todo Liste de Développement

> Scope : plateforme complète hors confirmation email, notifications et paiement.

---

## Fondation

- [x] CLAUDE.md — documentation codebase
- [x] TODO.md — cette liste
- [x] Packages : `prisma @prisma/client jose bcryptjs @types/bcryptjs`
- [x] `prisma/schema.prisma` — modèles User, Company, Opportunity, Collaboration, CollaborationMember, CollaborationMessage, SavedOpportunity, OpportunityInterest, Guide, Submission
- [x] `prisma/seed.ts` — données de démo (admin + membres + opportunités + guides)
- [x] `src/lib/db.ts` — singleton Prisma client
- [x] `src/lib/auth.ts` — JWT sign/verify, helpers session
- [x] `src/lib/types.ts` — types TypeScript partagés
- [x] `src/middleware.ts` — protection des routes par rôle et statut cotisation

---

## Authentification

- [x] `POST /api/auth/register` — crée User + Company (statut PENDING)
- [x] `POST /api/auth/login` — vérifie credentials, pose cookie JWT HTTP-only
- [x] `POST /api/auth/logout` — efface le cookie
- [x] `GET  /api/auth/me` — retourne l'utilisateur courant depuis le cookie
- [x] `src/app/login/page.tsx` — page de connexion (email + mot de passe)

---

## API Routes

### Opportunités
- [x] `GET  /api/opportunities` — liste filtrée (bailleur, secteur, complexité)
- [x] `POST /api/opportunities` — créer une opportunité (admin)
- [x] `GET  /api/opportunities/[id]` — détail complet
- [x] `PUT  /api/opportunities/[id]` — modifier (admin)
- [x] `DELETE /api/opportunities/[id]` — supprimer (admin)
- [x] `POST /api/opportunities/[id]/interest` — toggle "Je suis intéressé" (membre)
- [x] `POST /api/opportunities/[id]/save` — toggle sauvegarder (membre)

### Membres
- [x] `GET  /api/members` — liste des membres (admin)
- [x] `GET  /api/members/[id]` — profil détaillé (admin)
- [x] `PUT  /api/members/[id]/status` — changer statut abonnement (admin)

### Profil
- [x] `GET  /api/profile` — profil de l'utilisateur connecté
- [x] `PUT  /api/profile` — mettre à jour le profil entreprise

### Dashboard
- [x] `GET  /api/dashboard/member` — stats membre (opportunités, collaborations, KPIs)
- [x] `GET  /api/dashboard/admin` — stats admin (membres, opportunités, revenus fictifs)

### Collaborations
- [x] `GET  /api/collaborations` — liste des collaborations du membre
- [x] `POST /api/collaborations` — créer un groupement
- [x] `GET  /api/collaborations/[id]` — détail groupement + membres + messages
- [x] `POST /api/collaborations/[id]/join` — rejoindre un groupement
- [x] `POST /api/collaborations/[id]/messages` — envoyer un message

### Guides
- [x] `GET  /api/guides` — liste des ressources téléchargeables

### Soumissions
- [x] `GET  /api/submissions` — liste des soumissions du membre
- [x] `POST /api/submissions` — déclarer une soumission
- [x] `PUT  /api/submissions/[id]` — mettre à jour résultat

---

## CSS & Design System

- [x] `src/app/globals.css` — ajouter variables dark dashboard platform

---

## Composants Platform Partagés

- [x] `src/components/platform/Sidebar.tsx` — navigation latérale (membre / admin)
- [x] `src/components/platform/TopBar.tsx` — barre supérieure + user info
- [x] `src/components/platform/KPICard.tsx` — carte indicateur clé
- [x] `src/components/platform/OpportunityCard.tsx` — carte opportunité liste
- [x] `src/components/platform/AlertBanner.tsx` — bandeau d'alerte couleur
- [x] `src/components/platform/MemberRow.tsx` — ligne membre tableau
- [x] `src/components/platform/ComplexityBadge.tsx` — badge complexité coloré

---

## Pages Membre (`/membre/*`)

- [x] `src/app/membre/layout.tsx` — layout protégé avec auth check + sidebar
- [x] `src/app/membre/dashboard/page.tsx` — dashboard membre (KPIs, opportunités récentes, collaborations)
- [x] `src/app/membre/opportunites/page.tsx` — liste avec filtres
- [x] `src/app/membre/opportunites/[id]/page.tsx` — fiche détaillée + actions (intéressé, sauvegarder, groupement)
- [x] `src/app/membre/profil/page.tsx` — édition profil entreprise
- [x] `src/app/membre/collaborations/page.tsx` — liste groupements actifs + créer
- [x] `src/app/membre/collaborations/[id]/page.tsx` — détail groupement + messagerie
- [x] `src/app/membre/outils/page.tsx` — bibliothèque guides + checklists

---

## Pages Admin (`/admin/*`)

- [x] `src/app/admin/layout.tsx` — layout admin protégé
- [x] `src/app/admin/dashboard/page.tsx` — dashboard admin (membres, cotisations, opportunités, collaborations)
- [x] `src/app/admin/membres/page.tsx` — liste membres + gestion statuts
- [x] `src/app/admin/opportunites/page.tsx` — liste opportunités publiées
- [x] `src/app/admin/opportunites/nouvelle/page.tsx` — formulaire création opportunité
- [x] `src/app/admin/opportunites/[id]/modifier/page.tsx` — formulaire modification
- [x] `src/app/admin/reporting/page.tsx` — statistiques et rapports

---

## Intégrations

- [x] Connecter `RegisterModal` à `POST /api/auth/register`
- [x] Ajouter lien "Se connecter" → `/login` dans Navbar

---

## Qualité

- [x] `npm run build` sans erreurs TypeScript
- [x] `npm run lint` sans warnings bloquants
