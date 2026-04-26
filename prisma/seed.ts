import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./prisma/dev.db";
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin ────────────────────────────────────────────────────────────────
  const adminPwd = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
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

  // ─── Membre ───────────────────────────────────────────────────────────────
  const memberPwd = await bcrypt.hash("membre123", 10);
  await prisma.user.upsert({
    where: { email: "membre@exemple.ci" },
    update: {},
    create: {
      email: "membre@exemple.ci",
      password: memberPwd,
      role: "MEMBER",
      company: {
        create: {
          name: "MON ENTREPRISE BTP",
          registrationNumber: "CI-ABJ-2020-M00001",
          taxId: "NIF-ME-2020",
          sector: "BTP – Routes & Terrassement",
          foundingDate: "2020-01-01",
          email: "contact@monentreprise.ci",
          phone: "+225 07 00 00 00 00",
          address: "Abidjan",
          city: "Abidjan",
          country: "Côte d'Ivoire",
          ceoName: "Votre Nom",
          ceoEmail: "membre@exemple.ci",
          ceoPhone: "+225 07 00 00 00 00",
          subscriptionStatus: "ACTIVE",
          subscriptionExpiry: new Date("2027-01-01"),
        },
      },
    },
  });

console.log("✅ Seed terminé !");
  console.log("───────────────────────────────────────");
  console.log("Admin  → admin@unie-btp.com  / admin123");
  console.log("Membre → membre@exemple.ci   / membre123");
  console.log("───────────────────────────────────────");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
