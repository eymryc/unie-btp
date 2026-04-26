import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.opportunityInterest.findUnique({
    where: { userId_opportunityId: { userId: session.userId, opportunityId: id } },
  });

  if (existing) {
    if (existing.level === "PARTICIPATING") {
      // Repasse à INTERESTED
      await prisma.opportunityInterest.update({
        where: { id: existing.id },
        data: { level: "INTERESTED" },
      });
      return NextResponse.json({ level: "INTERESTED" });
    }
    // Passe à PARTICIPATING
    await prisma.opportunityInterest.update({
      where: { id: existing.id },
      data: { level: "PARTICIPATING" },
    });
    return NextResponse.json({ level: "PARTICIPATING" });
  }

  // Crée avec niveau PARTICIPATING
  await prisma.opportunityInterest.create({
    data: { userId: session.userId, opportunityId: id, level: "PARTICIPATING" },
  });
  return NextResponse.json({ level: "PARTICIPATING" });
}
