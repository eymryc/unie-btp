import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName, registrationNumber, taxId, sector, foundingDate,
      companyEmail, phone, website, address, city, country,
      ceoName, ceoEmail, ceoPhone, password,
    } = body;

    if (!companyEmail || !password || !companyName) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: ceoEmail } });
    if (existing) {
      return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: ceoEmail,
        password: hashed,
        role: "MEMBER",
        company: {
          create: {
            name: companyName,
            registrationNumber,
            taxId,
            sector,
            foundingDate,
            email: companyEmail,
            phone,
            website: website || null,
            address,
            city,
            country: country ?? "Côte d'Ivoire",
            ceoName,
            ceoEmail,
            ceoPhone,
            subscriptionStatus: "PENDING",
          },
        },
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
