import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.savedOpportunity.findUnique({
    where: { userId_opportunityId: { userId: session.userId, opportunityId: id } },
  });

  if (existing) {
    await prisma.savedOpportunity.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedOpportunity.create({
    data: { userId: session.userId, opportunityId: id },
  });
  return NextResponse.json({ saved: true });
}
