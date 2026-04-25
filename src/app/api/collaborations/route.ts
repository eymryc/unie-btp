import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";

  const collabs = isAdmin
    ? await prisma.collaboration.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { members: true } }, opportunity: { select: { title: true } } },
      })
    : await prisma.collaboration.findMany({
        where: { members: { some: { userId: session.userId } } },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { members: true } }, opportunity: { select: { title: true } } },
      });

  return NextResponse.json(
    collabs.map((c) => ({
      id: c.id,
      title: c.title,
      status: c.status,
      description: c.description,
      memberCount: c._count.members,
      opportunityTitle: c.opportunity.title,
      createdAt: c.createdAt.toISOString(),
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { title, opportunityId, description } = await req.json();

  if (!title || !opportunityId) {
    return NextResponse.json({ error: "Titre et opportunité requis." }, { status: 400 });
  }

  const collab = await prisma.collaboration.create({
    data: {
      title,
      opportunityId,
      description: description || null,
      members: {
        create: { userId: session.userId, isLead: true },
      },
    },
  });

  return NextResponse.json(collab, { status: 201 });
}
