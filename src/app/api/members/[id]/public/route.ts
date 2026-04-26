import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { userId: id },
    select: {
      name: true, sector: true, city: true, country: true,
      specialties: true, equipment: true, employees: true,
      geographicZone: true, description: true,
      availability: true, availabilityNote: true,
      references: true, foundingDate: true,
      documents: {
        where: { docType: "reference_projet" },
        select: { id: true, name: true, fileName: true, fileUrl: true, createdAt: true },
      },
    },
  });

  if (!company) return NextResponse.json({ error: "Introuvable." }, { status: 404 });

  return NextResponse.json({
    ...company,
    references: company.references ? JSON.parse(company.references) : [],
  });
}
