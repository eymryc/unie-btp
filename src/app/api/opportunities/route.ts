import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const funder = searchParams.get("funder");
  const sector = searchParams.get("sector");
  const complexity = searchParams.get("complexity");
  const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";

  const where: Record<string, unknown> = {};
  if (!isAdmin) where.isPublished = true;
  if (funder) where.funder = funder;
  if (sector) where.sector = sector;
  if (complexity) where.complexity = complexity;

  const opps = await prisma.opportunity.findMany({
    where,
    orderBy: { closingDate: "asc" },
    include: {
      _count: { select: { interests: true } },
      saved: { where: { userId: session.userId }, select: { id: true } },
      interests: { where: { userId: session.userId }, select: { id: true } },
    },
  });

  const data = opps.map((o) => ({
    id: o.id,
    title: o.title,
    description: o.description,
    funder: o.funder,
    sector: o.sector,
    complexity: o.complexity,
    location: o.location,
    budget: o.budget,
    closingDate: o.closingDate.toISOString(),
    isPublished: o.isPublished,
    interestCount: o._count.interests,
    isSaved: o.saved.length > 0,
    isInterested: o.interests.length > 0,
    createdAt: o.createdAt.toISOString(),
  }));

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const opp = await prisma.opportunity.create({
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
    return NextResponse.json(opp, { status: 201 });
  } catch (err) {
    console.error("[opportunities POST]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
