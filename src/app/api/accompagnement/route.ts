import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { opportunityId, type, message } = await req.json();

  if (!message?.trim()) return NextResponse.json({ error: "Message requis." }, { status: 400 });

  const request = await prisma.accompagnementRequest.create({
    data: {
      userId: session.userId,
      opportunityId: opportunityId || null,
      type: type ?? "autre",
      message: message.trim(),
    },
  });

  return NextResponse.json(request, { status: 201 });
}

export async function GET() {
  const session = await getServerSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const requests = await prisma.accompagnementRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { include: { company: { select: { name: true, sector: true } } } },
    },
  });

  return NextResponse.json(
    requests.map((r) => ({
      id: r.id,
      companyName: r.user.company?.name ?? r.user.email,
      sector: r.user.company?.sector ?? "",
      type: r.type,
      message: r.message,
      status: r.status,
      opportunityId: r.opportunityId,
      createdAt: r.createdAt.toISOString(),
    }))
  );
}
