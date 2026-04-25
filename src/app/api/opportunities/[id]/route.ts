import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;
  const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";

  const opp = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      _count: { select: { interests: true } },
      saved: { where: { userId: session.userId }, select: { id: true } },
      interests: { where: { userId: session.userId }, select: { id: true } },
      collaborations: {
        include: { _count: { select: { members: true } } },
      },
    },
  });

  if (!opp) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  if (!isAdmin && !opp.isPublished) return NextResponse.json({ error: "Non autorisé." }, { status: 403 });

  return NextResponse.json({
    id: opp.id,
    title: opp.title,
    description: opp.description,
    funder: opp.funder,
    sector: opp.sector,
    complexity: opp.complexity,
    location: opp.location,
    budget: opp.budget,
    closingDate: opp.closingDate.toISOString(),
    isPublished: opp.isPublished,
    interestCount: opp._count.interests,
    isSaved: opp.saved.length > 0,
    isInterested: opp.interests.length > 0,
    requirements: opp.requirements ? JSON.parse(opp.requirements) : [],
    strategicAdvice: opp.strategicAdvice,
    requiredDocs: opp.requiredDocs ? JSON.parse(opp.requiredDocs) : [],
    createdAt: opp.createdAt.toISOString(),
    collaborations: opp.collaborations.map((c) => ({
      id: c.id,
      title: c.title,
      status: c.status,
      memberCount: c._count.members,
    })),
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  try {
    const updated = await prisma.opportunity.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        funder: body.funder,
        sector: body.sector,
        complexity: body.complexity,
        location: body.location || null,
        budget: body.budget || null,
        closingDate: new Date(body.closingDate),
        requirements: body.requirements ? JSON.stringify(body.requirements) : null,
        strategicAdvice: body.strategicAdvice || null,
        requiredDocs: body.requiredDocs ? JSON.stringify(body.requiredDocs) : null,
        isPublished: body.isPublished ?? false,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[opportunity PUT]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { id } = await params;
  await prisma.opportunity.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
