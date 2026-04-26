import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const sector = searchParams.get("sector");
  const availability = searchParams.get("availability");

  const where: Record<string, unknown> = {
    subscriptionStatus: "ACTIVE",
    user: { role: "MEMBER" },
  };
  if (sector) where.sector = sector;
  if (availability) where.availability = availability;

  const companies = await prisma.company.findMany({
    where,
    select: {
      userId: true,
      name: true,
      sector: true,
      city: true,
      country: true,
      specialties: true,
      equipment: true,
      employees: true,
      geographicZone: true,
      description: true,
      availability: true,
      availabilityNote: true,
      references: true,
      foundingDate: true,
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(companies);
}
