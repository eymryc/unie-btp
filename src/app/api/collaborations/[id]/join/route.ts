import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.collaborationMember.findUnique({
    where: { collaborationId_userId: { collaborationId: id, userId: session.userId } },
  });

  if (existing) return NextResponse.json({ error: "Déjà membre de ce groupement." }, { status: 409 });

  await prisma.collaborationMember.create({
    data: { collaborationId: id, userId: session.userId },
  });

  return NextResponse.json({ success: true });
}
