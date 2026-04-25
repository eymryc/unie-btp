import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Assure que DATABASE_URL est défini avant d'instancier Prisma
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./prisma/dev.db";
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin ────────────────────────────────────────────────────────────────
  const adminPwd = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@unie-btp.com" },
    update: {},
    create: {
      email: "admin@unie-btp.com",
      password: adminPwd,
      role: "ADMIN",
      company: {
        create: {
          name: "UNIE BTP Administration",
          registrationNumber: "CI-ABJ-2023-A00001",
          taxId: "ADM-0001",
          sector: "Administration",
          foundingDate: "2023-01-01",
          email: "admin@unie-btp.com",
          phone: "+225 07 09 60 62 86",
          address: "Cocody, Riviera",
          city: "Abidjan",
          ceoName: "Directeur UNIE BTP",
          ceoEmail: "admin@unie-btp.com",
          ceoPhone: "+225 07 09 60 62 86",
          subscriptionStatus: "ACTIVE",
        },
      },
    },
  });

  // ─── Membres ──────────────────────────────────────────────────────────────
  const memberPwd = await bcrypt.hash("membre123", 10);

  const member1 = await prisma.user.upsert({
    where: { email: "batikonan@exemple.ci" },
    update: {},
    create: {
      email: "batikonan@exemple.ci",
      password: memberPwd,
      role: "MEMBER",
      company: {
        create: {
          name: "BATI KONAN SARL",
          registrationNumber: "CI-ABJ-2018-B12345",
          taxId: "NIF-BK-2018",
          sector: "BTP – Routes & Terrassement",
          foundingDate: "2018-03-15",
          email: "contact@batikonan.ci",
          phone: "+225 07 11 22 33 44",
          address: "Zone Industrielle de Yopougon",
          city: "Abidjan",
          country: "Côte d'Ivoire",
          ceoName: "Konan Barthélémy",
          ceoEmail: "batikonan@exemple.ci",
          ceoPhone: "+225 07 11 22 33 44",
          specialties: "Terrassement, Nivellement, Routes en latérite",
          equipment: "Niveleuse CAT 140M, Compacteur BOMAG BW213, Tombereau BELL B25",
          employees: 45,
          geographicZone: "Grand Abidjan, Région des Lacs, Région du Bélier",
          description: "Entreprise spécialisée dans les travaux de routes rurales et de terrassement depuis 2018. Références: 12 marchés BAD, 8 marchés AFD.",
          subscriptionStatus: "ACTIVE",
          subscriptionExpiry: new Date("2026-01-01"),
        },
      },
    },
  });

  const member2 = await prisma.user.upsert({
    where: { email: "technoconstruire@exemple.ci" },
    update: {},
    create: {
      email: "technoconstruire@exemple.ci",
      password: memberPwd,
      role: "MEMBER",
      company: {
        create: {
          name: "TECHNO-CONSTRUIRE CI",
          registrationNumber: "CI-ABJ-2015-T56789",
          taxId: "NIF-TC-2015",
          sector: "Bâtiment & Génie Civil",
          foundingDate: "2015-07-20",
          email: "contact@technoconstruire.ci",
          phone: "+225 05 44 55 66 77",
          address: "Plateau, Avenue Houdaille",
          city: "Abidjan",
          ceoName: "Touré Cheick",
          ceoEmail: "technoconstruire@exemple.ci",
          ceoPhone: "+225 05 44 55 66 77",
          specialties: "Construction de bâtiments publics, Génie civil, Béton armé",
          employees: 78,
          subscriptionStatus: "ACTIVE",
          subscriptionExpiry: new Date("2025-12-01"),
        },
      },
    },
  });

  const member3 = await prisma.user.upsert({
    where: { email: "aquamanagement@exemple.ci" },
    update: {},
    create: {
      email: "aquamanagement@exemple.ci",
      password: memberPwd,
      role: "MEMBER",
      company: {
        create: {
          name: "AQUA MANAGEMENT SARL",
          registrationNumber: "CI-ABJ-2019-A98765",
          taxId: "NIF-AM-2019",
          sector: "Hydraulique & Assainissement",
          foundingDate: "2019-01-10",
          email: "contact@aquamanagement.ci",
          phone: "+225 01 77 88 99 00",
          address: "Marcory, Rue des Jardins",
          city: "Abidjan",
          ceoName: "Assoumou Michel",
          ceoEmail: "aquamanagement@exemple.ci",
          ceoPhone: "+225 01 77 88 99 00",
          specialties: "Forage, Adduction d'eau potable, Assainissement, Drainage",
          employees: 32,
          subscriptionStatus: "ACTIVE",
          subscriptionExpiry: new Date("2026-03-01"),
        },
      },
    },
  });

  const member4 = await prisma.user.upsert({
    where: { email: "solardev@exemple.ci" },
    update: {},
    create: {
      email: "solardev@exemple.ci",
      password: memberPwd,
      role: "MEMBER",
      company: {
        create: {
          name: "SOLAR-DEV CI",
          registrationNumber: "CI-ABJ-2020-S11223",
          taxId: "NIF-SD-2020",
          sector: "Énergie & Électricité",
          foundingDate: "2020-06-01",
          email: "contact@solardev.ci",
          phone: "+225 07 22 33 44 55",
          address: "Cocody, Angré 8ème Tranche",
          city: "Abidjan",
          ceoName: "Diomandé Sekou",
          ceoEmail: "solardev@exemple.ci",
          ceoPhone: "+225 07 22 33 44 55",
          specialties: "Énergie solaire, Installations photovoltaïques, Électrification rurale",
          employees: 18,
          subscriptionStatus: "SUSPENDED",
        },
      },
    },
  });

  const member5 = await prisma.user.upsert({
    where: { email: "diaspoconstruction@exemple.ci" },
    update: {},
    create: {
      email: "diaspoconstruction@exemple.ci",
      password: memberPwd,
      role: "MEMBER",
      company: {
        create: {
          name: "DIASPO CONSTRUCTION",
          registrationNumber: "CI-ABJ-2024-D44556",
          taxId: "NIF-DC-2024",
          sector: "BTP – Bâtiment & Logement",
          foundingDate: "2024-02-01",
          email: "contact@diaspoconst.ci",
          phone: "+225 05 99 88 77 66",
          address: "Treichville, Rue 12",
          city: "Abidjan",
          ceoName: "Coulibaly Drissa",
          ceoEmail: "diaspoconstruction@exemple.ci",
          ceoPhone: "+225 05 99 88 77 66",
          employees: 12,
          subscriptionStatus: "PENDING",
        },
      },
    },
  });

  // ─── Opportunités ─────────────────────────────────────────────────────────
  const opp1 = await prisma.opportunity.upsert({
    where: { id: "opp_routes_lacs" },
    update: {},
    create: {
      id: "opp_routes_lacs",
      title: "Réhabilitation de routes rurales – Région des Lacs",
      description: "Réhabilitation de 850 km de routes rurales en latérite dans la région des Lacs. Travaux de terrassement, drainage et reprofilage sur 3 lots géographiques. Durée estimée du marché : 18 mois.",
      funder: "BAD",
      sector: "BTP – Routes",
      complexity: "ACCESSIBLE",
      location: "Région des Lacs, Côte d'Ivoire",
      budget: "4,2 Mds FCFA",
      closingDate: new Date("2025-05-15"),
      requirements: JSON.stringify([
        "Expérience d'au moins 2 marchés similaires sur 5 ans",
        "Chiffre d'affaires annuel min. 300M FCFA justifié",
        "Matériel requis : niveleuse, compacteur, tombereau",
        "Agrément BTP Côte d'Ivoire obligatoire",
      ]),
      strategicAdvice: "Ce marché est accessible en candidature individuelle pour les entreprises disposant du matériel requis. Envisagez le lot 2 (secteur Est) qui présente moins de concurrence attendue.",
      requiredDocs: JSON.stringify([
        "Dossier administratif complet (attestations fiscales, CNPS)",
        "CV d'entreprise avec références chiffrées",
        "Attestation de disponibilité du matériel",
        "Offre financière + bordereau de prix",
        "Mémoire technique (méthodologie + planning)",
      ]),
      isPublished: true,
    },
  });

  const opp2 = await prisma.opportunity.upsert({
    where: { id: "opp_ecole_bouake" },
    update: {},
    create: {
      id: "opp_ecole_bouake",
      title: "Construction école primaire – 3 lots – Bouaké",
      description: "Construction de 3 groupes scolaires de 12 salles chacun à Bouaké. Lots indépendants, possibilité de soumission partielle. Capacité financière 500M FCFA requise.",
      funder: "AFD",
      sector: "Bâtiment",
      complexity: "GROUPEMENT",
      location: "Bouaké, Côte d'Ivoire",
      budget: "1,8 Md FCFA",
      closingDate: new Date("2025-05-22"),
      requirements: JSON.stringify([
        "Capacité financière min. 500M FCFA",
        "Références en construction de bâtiments publics (min. 3)",
        "Chef de projet qualifié (ingénieur génie civil)",
        "Plan d'assurance qualité",
      ]),
      strategicAdvice: "Groupement conseillé pour les lots 2 et 3 nécessitant une capacité financière combinée. Idéal pour associer un spécialiste gros œuvre et un spécialiste second œuvre.",
      requiredDocs: JSON.stringify([
        "Dossier administratif",
        "Capacité financière (bilan 3 ans)",
        "Références similaires avec attestation de bonne exécution",
        "Organigramme du projet",
        "Note méthodologique",
      ]),
      isPublished: true,
    },
  });

  const opp3 = await prisma.opportunity.upsert({
    where: { id: "opp_centrale_solaire" },
    update: {},
    create: {
      id: "opp_centrale_solaire",
      title: "Centrale solaire photovoltaïque 50 MW – Réseau national",
      description: "Installation d'une centrale solaire de 50 MW connectée au réseau interconnecté. Génie civil + équipements électriques. Expérience internationale exigée.",
      funder: "Banque Mondiale",
      sector: "Énergie",
      complexity: "CONSORTIUM",
      location: "Côte d'Ivoire (site à confirmer)",
      budget: "28 Mds FCFA",
      closingDate: new Date("2025-05-08"),
      requirements: JSON.stringify([
        "Expérience internationale en centrales solaires (min. 20 MW)",
        "Capacité financière > 5 Mds FCFA",
        "Partenariat avec fabricant de panneaux certifié IEC",
        "Références en connexion réseau haute tension",
        "Certifications ISO 9001 + ISO 14001",
      ]),
      strategicAdvice: "Ce marché nécessite impérativement un consortium avec un partenaire international spécialisé en énergie solaire. La composante génie civil peut être portée par une entreprise locale.",
      requiredDocs: JSON.stringify([
        "Accord de consortium signé",
        "Références internationales certifiées",
        "Capacité financière consolidée",
        "Plan de financement",
        "Étude technique de faisabilité",
      ]),
      isPublished: true,
    },
  });

  const opp4 = await prisma.opportunity.upsert({
    where: { id: "opp_eau_abidjan" },
    update: {},
    create: {
      id: "opp_eau_abidjan",
      title: "Adduction d'eau potable – 8 communes rurales – Abidjan Nord",
      description: "Réalisation de forages, stations de pompage et réseaux de distribution d'eau potable dans 8 communes périurbaines au nord d'Abidjan.",
      funder: "BAD",
      sector: "Hydraulique",
      complexity: "ACCESSIBLE",
      location: "Abidjan Nord, Côte d'Ivoire",
      budget: "2,4 Mds FCFA",
      closingDate: new Date("2025-06-03"),
      requirements: JSON.stringify([
        "Expérience en forage et adduction d'eau (min. 3 projets)",
        "Hydrogéologue qualifié dans l'équipe",
        "Matériel de forage disponible (foreuse rotative min. 500m)",
        "Agrément hydraulique requis",
      ]),
      strategicAdvice: "Opportunité accessible pour les entreprises hydrauliques confirmées. Possibilité de sous-traiter le génie civil des bâtiments à un membre UNIE BTP.",
      requiredDocs: JSON.stringify([
        "Agrément hydraulique",
        "CV hydrogéologue",
        "Fiche technique foreuse",
        "Références avec PV de réception",
        "Offre technique + offre financière",
      ]),
      isPublished: true,
    },
  });

  const opp5 = await prisma.opportunity.upsert({
    where: { id: "opp_centres_sante" },
    update: {},
    create: {
      id: "opp_centres_sante",
      title: "Construction centres de santé – 12 sites – Yamoussoukro",
      description: "Construction de 12 centres de santé ruraux dans la région de Yamoussoukro, incluant bâtiments, voiries intérieures et réseaux techniques.",
      funder: "AFD",
      sector: "Bâtiment",
      complexity: "GROUPEMENT",
      location: "Yamoussoukro et environs",
      budget: "3,1 Mds FCFA",
      closingDate: new Date("2025-05-28"),
      requirements: JSON.stringify([
        "Expérience en bâtiments sanitaires ou publics",
        "Capacité financière 800M FCFA",
        "Chef de projet BTP + Ingénieur électromécanique",
        "Expérience en marchés AFD appréciée",
      ]),
      strategicAdvice: "Marché découpé en 4 lots de 3 sites. Groupement conseillé entre spécialistes bâtiment et corps d'état techniques (plomberie, électricité).",
      requiredDocs: JSON.stringify([
        "Dossier administratif",
        "Capacité technique et financière",
        "Références bâtiments publics",
        "Plan qualité",
        "Mémoire technique",
      ]),
      isPublished: true,
    },
  });

  // Opportunité non publiée (brouillon admin)
  await prisma.opportunity.upsert({
    where: { id: "opp_draft_route_nord" },
    update: {},
    create: {
      id: "opp_draft_route_nord",
      title: "[BROUILLON] Route nationale N1 – Section nord",
      description: "En cours d'analyse...",
      funder: "BAD",
      sector: "BTP – Routes",
      complexity: "CONSORTIUM",
      closingDate: new Date("2025-07-01"),
      isPublished: false,
    },
  });

  // ─── Intérêts et sauvegardes ──────────────────────────────────────────────
  await prisma.opportunityInterest.upsert({
    where: { userId_opportunityId: { userId: member1.id, opportunityId: opp1.id } },
    update: {},
    create: { userId: member1.id, opportunityId: opp1.id },
  });
  await prisma.opportunityInterest.upsert({
    where: { userId_opportunityId: { userId: member2.id, opportunityId: opp2.id } },
    update: {},
    create: { userId: member2.id, opportunityId: opp2.id },
  });
  await prisma.opportunityInterest.upsert({
    where: { userId_opportunityId: { userId: member3.id, opportunityId: opp4.id } },
    update: {},
    create: { userId: member3.id, opportunityId: opp4.id },
  });
  await prisma.savedOpportunity.upsert({
    where: { userId_opportunityId: { userId: member1.id, opportunityId: opp4.id } },
    update: {},
    create: { userId: member1.id, opportunityId: opp4.id },
  });

  // ─── Collaborations ───────────────────────────────────────────────────────
  const collab1 = await prisma.collaboration.upsert({
    where: { id: "collab_routes_lacs" },
    update: {},
    create: {
      id: "collab_routes_lacs",
      title: "Groupement – Réhabilitation routes Région des Lacs – Lot 2",
      opportunityId: opp1.id,
      status: "ACTIVE",
      description: "Groupement de 3 entreprises pour répondre au lot 2 (secteur Est). BATI KONAN en entreprise mandataire.",
    },
  });

  await prisma.collaborationMember.upsert({
    where: { collaborationId_userId: { collaborationId: collab1.id, userId: member1.id } },
    update: {},
    create: { collaborationId: collab1.id, userId: member1.id, isLead: true },
  });
  await prisma.collaborationMember.upsert({
    where: { collaborationId_userId: { collaborationId: collab1.id, userId: member2.id } },
    update: {},
    create: { collaborationId: collab1.id, userId: member2.id },
  });
  await prisma.collaborationMember.upsert({
    where: { collaborationId_userId: { collaborationId: collab1.id, userId: member3.id } },
    update: {},
    create: { collaborationId: collab1.id, userId: member3.id },
  });

  const msgCount = await prisma.collaborationMessage.count({ where: { collaborationId: collab1.id } });
  if (msgCount === 0) {
    await prisma.collaborationMessage.createMany({
      data: [
        { collaborationId: collab1.id, userId: member1.id, content: "Bonjour à tous, j'ai commencé à préparer le mémoire technique. Qui s'occupe du bordereau des prix ?", createdAt: new Date("2025-04-20T09:15:00Z") },
        { collaborationId: collab1.id, userId: member2.id, content: "Je prends en charge le bordereau des prix et l'offre financière. Deadline : vendredi.", createdAt: new Date("2025-04-20T10:30:00Z") },
        { collaborationId: collab1.id, userId: member3.id, content: "OK pour moi. Je fournis les attestations de bonne exécution pour les 3 marchés hydrauliques.", createdAt: new Date("2025-04-20T11:00:00Z") },
        { collaborationId: collab1.id, userId: member1.id, content: "Parfait. Réunion de validation jeudi 24 avril à 14h au siège BATI KONAN.", createdAt: new Date("2025-04-21T08:00:00Z") },
      ],
    });
  }

  const collab2 = await prisma.collaboration.upsert({
    where: { id: "collab_centrale" },
    update: {},
    create: {
      id: "collab_centrale",
      title: "Consortium – Centrale solaire 50 MW",
      opportunityId: opp3.id,
      status: "FORMING",
      description: "Formation d'un consortium pour la composante génie civil de la centrale solaire. Recherche partenaire international énergie.",
    },
  });

  await prisma.collaborationMember.upsert({
    where: { collaborationId_userId: { collaborationId: collab2.id, userId: member1.id } },
    update: {},
    create: { collaborationId: collab2.id, userId: member1.id, isLead: true },
  });

  // ─── Soumissions ──────────────────────────────────────────────────────────
  await prisma.submission.upsert({
    where: { id: "sub_member1_opp1" },
    update: {},
    create: {
      id: "sub_member1_opp1",
      userId: member1.id,
      opportunityId: opp1.id,
      status: "PREPARING",
      notes: "Dossier en cours de préparation avec le groupement.",
    },
  });

  // ─── Guides ───────────────────────────────────────────────────────────────
  const guideCount = await prisma.guide.count();
  if (guideCount === 0) {
    await prisma.guide.createMany({
      data: [
        { title: "Checklist de soumission BAD", description: "Liste complète des documents requis pour soumettre un dossier à la Banque Africaine de Développement.", category: "checklist", isPublished: true },
        { title: "Modèle mémoire technique BTP", description: "Trame standard de mémoire technique pour les marchés de travaux (méthodologie, planning, moyens).", category: "modele", isPublished: true },
        { title: "Trame CV d'entreprise", description: "Modèle de présentation de l'entreprise avec références projets et capacités techniques.", category: "modele", isPublished: true },
        { title: "Modèle planning Gantt", description: "Planning type en format Excel pour la soumission d'un calendrier d'exécution.", category: "modele", isPublished: true },
        { title: "Guide réponse Banque Mondiale", description: "Procédures BIRD et IDA : étapes, formulaires, critères d'évaluation.", category: "guide", isPublished: true },
        { title: "Guide procédures AFD", description: "Comment répondre aux appels d'offres financés par l'Agence Française de Développement.", category: "guide", isPublished: true },
        { title: "Dossier type entreprise BTP", description: "Kit complet de documents administratifs à maintenir à jour pour toute soumission.", category: "checklist", isPublished: true },
      ],
    });
  }

  console.log("✅ Seed terminé !");
  console.log("───────────────────────────────────────────");
  console.log("Admin   → admin@unie-btp.com    / admin123");
  console.log("Membre  → batikonan@exemple.ci  / membre123");
  console.log("Membre  → aquamanagement@exemple.ci / membre123");
  console.log("───────────────────────────────────────────");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
