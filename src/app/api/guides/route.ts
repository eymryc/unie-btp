import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";

  const guides = await prisma.guide.findMany({
    where: isAdmin ? {} : { isPublished: true },
    orderBy: [{ category: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(guides);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { title, description, category, fileUrl, isPublished } = await req.json();
  if (!title || !category) return NextResponse.json({ error: "Titre et catégorie requis." }, { status: 400 });

  const guide = await prisma.guide.create({
    data: { title, description: description || null, category, fileUrl: fileUrl || null, isPublished: isPublished ?? true },
  });

  return NextResponse.json(guide, { status: 201 });
}
