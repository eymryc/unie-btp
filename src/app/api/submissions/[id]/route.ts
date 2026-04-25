import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;
  const { status, result, notes } = await req.json();

  const sub = await prisma.submission.findUnique({ where: { id } });
  if (!sub || sub.userId !== session.userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const updated = await prisma.submission.update({
    where: { id },
    data: {
      status: status ?? sub.status,
      result: result ?? sub.result,
      notes: notes ?? sub.notes,
    },
  });

  return NextResponse.json(updated);
}
