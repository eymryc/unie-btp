import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const company = await prisma.company.findUnique({ where: { userId: session.userId } });
  if (!company) return NextResponse.json([]);

  const docs = await prisma.companyDocument.findMany({
    where: { companyId: company.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(docs);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await req.json();
  const company = await prisma.company.findUnique({ where: { userId: session.userId } });
  if (!company) return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });

  const doc = await prisma.companyDocument.findUnique({ where: { id } });
  if (!doc || doc.companyId !== company.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  await prisma.companyDocument.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
