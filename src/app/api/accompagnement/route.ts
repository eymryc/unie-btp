import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { opportunityId, trainingSessionId, type, message } = await req.json();

  if (!message?.trim()) return NextResponse.json({ error: "Message requis." }, { status: 400 });

  const request = await prisma.accompagnementRequest.create({
    data: {
      userId: session.userId,
      opportunityId: opportunityId || null,
      trainingSessionId: trainingSessionId || null,
      type: type ?? "autre",
      message: message.trim(),
    },
  });

  return NextResponse.json(request, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";

  const requests = await prisma.accompagnementRequest.findMany({
    where: {
      ...(isAdmin ? {} : { userId: session.userId }),
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: { include: { company: { select: { name: true, sector: true } } } },
      trainingSession: { select: { id: true, title: true } },
    },
  });

  return NextResponse.json(
    requests.map((r) => ({
      id: r.id,
      companyName: isAdmin ? (r.user.company?.name ?? r.user.email) : undefined,
      sector: isAdmin ? (r.user.company?.sector ?? "") : undefined,
      type: r.type,
      message: r.message,
      status: r.status,
      opportunityId: r.opportunityId,
      trainingSessionId: r.trainingSessionId,
      trainingSessionTitle: r.trainingSession?.title ?? null,
      createdAt: r.createdAt.toISOString(),
    }))
  );
}
