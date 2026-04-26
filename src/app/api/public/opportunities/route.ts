import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Endpoint public — retourne un aperçu limité (pas de détails complets)
export async function GET() {
  const opps = await prisma.opportunity.findMany({
    where: { isPublished: true },
    orderBy: { closingDate: "asc" },
    take: 6,
    select: {
      id: true, title: true, funder: true, sector: true,
      complexity: true, closingDate: true, budget: true,
      _count: { select: { interests: true } },
    },
  });

  return NextResponse.json(
    opps.map((o) => ({
      id: o.id,
      // Titre tronqué pour les visiteurs
      title: o.title.length > 55 ? o.title.slice(0, 55) + "…" : o.title,
      funder: o.funder,
      sector: o.sector,
      complexity: o.complexity,
      closingDate: o.closingDate.toISOString(),
      budget: o.budget,
      interestCount: o._count.interests,
    }))
  );
}
