import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const company = await prisma.company.findUnique({
    where: { userId: session.userId },
    include: { documents: { orderBy: { createdAt: "desc" } } },
  });

  if (!company) return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });

  return NextResponse.json({
    ...company,
    references: company.references ? JSON.parse(company.references) : [],
    subscriptionExpiry: company.subscriptionExpiry?.toISOString() ?? null,
  });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await req.json();

  const updated = await prisma.company.update({
    where: { userId: session.userId },
    data: {
      phone:             body.phone,
      website:           body.website || null,
      address:           body.address,
      city:              body.city,
      specialties:       body.specialties || null,
      equipment:         body.equipment || null,
      employees:         body.employees ? parseInt(body.employees) : null,
      geographicZone:    body.geographicZone || null,
      description:       body.description || null,
      availability:      body.availability || null,
      availabilityNote:  body.availabilityNote || null,
      references:        body.references ? JSON.stringify(body.references) : null,
    },
  });

  return NextResponse.json({ ...updated, subscriptionExpiry: updated.subscriptionExpiry?.toISOString() ?? null });
}
