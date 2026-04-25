import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;

  const collab = await prisma.collaboration.findUnique({
    where: { id },
    include: {
      opportunity: { select: { id: true, title: true, funder: true, closingDate: true } },
      members: {
        include: {
          user: {
            include: { company: { select: { name: true, sector: true } } },
          },
        },
        orderBy: { joinedAt: "asc" },
      },
      messages: {
        include: {
          user: { include: { company: { select: { name: true } } } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!collab) return NextResponse.json({ error: "Introuvable." }, { status: 404 });

  const isMember = collab.members.some((m) => m.userId === session.userId);
  const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";
  if (!isMember && !isAdmin) return NextResponse.json({ error: "Non autorisé." }, { status: 403 });

  return NextResponse.json({
    id: collab.id,
    title: collab.title,
    status: collab.status,
    description: collab.description,
    opportunity: {
      ...collab.opportunity,
      closingDate: collab.opportunity.closingDate.toISOString(),
    },
    members: collab.members.map((m) => ({
      id: m.id,
      userId: m.userId,
      isLead: m.isLead,
      joinedAt: m.joinedAt.toISOString(),
      companyName: m.user.company?.name ?? m.user.email,
      sector: m.user.company?.sector ?? "",
    })),
    messages: collab.messages.map((msg) => ({
      id: msg.id,
      userId: msg.userId,
      content: msg.content,
      createdAt: msg.createdAt.toISOString(),
      companyName: msg.user.company?.name ?? msg.user.email,
    })),
    isMember,
    isLead: collab.members.find((m) => m.userId === session.userId)?.isLead ?? false,
  });
}
