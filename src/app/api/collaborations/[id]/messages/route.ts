import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;
  const { content } = await req.json();

  if (!content?.trim()) return NextResponse.json({ error: "Message vide." }, { status: 400 });

  const isMember = await prisma.collaborationMember.findUnique({
    where: { collaborationId_userId: { collaborationId: id, userId: session.userId } },
  });
  if (!isMember) return NextResponse.json({ error: "Non membre de ce groupement." }, { status: 403 });

  const msg = await prisma.collaborationMessage.create({
    data: { collaborationId: id, userId: session.userId, content: content.trim() },
    include: { user: { include: { company: { select: { name: true } } } } },
  });

  return NextResponse.json({
    id: msg.id,
    userId: msg.userId,
    content: msg.content,
    createdAt: msg.createdAt.toISOString(),
    companyName: msg.user.company?.name ?? msg.user.email,
  });
}
