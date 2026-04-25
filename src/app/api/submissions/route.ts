import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const subs = await prisma.submission.findMany({
    where: { userId: session.userId },
    include: { opportunity: { select: { title: true, funder: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    subs.map((s) => ({
      id: s.id,
      opportunityId: s.opportunityId,
      opportunityTitle: s.opportunity.title,
      funder: s.opportunity.funder,
      status: s.status,
      result: s.result,
      notes: s.notes,
      createdAt: s.createdAt.toISOString(),
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { opportunityId, notes } = await req.json();

  const sub = await prisma.submission.create({
    data: { userId: session.userId, opportunityId, notes: notes || null, status: "PREPARING" },
  });

  return NextResponse.json(sub, { status: 201 });
}
