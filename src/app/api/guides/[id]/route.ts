import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  const guide = await prisma.guide.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description || null,
      category: body.category,
      fileUrl: body.fileUrl || null,
      isPublished: body.isPublished ?? true,
    },
  });
  return NextResponse.json(guide);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }
  const { id } = await params;
  await prisma.guide.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
