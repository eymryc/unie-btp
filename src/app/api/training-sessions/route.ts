import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";

  const sessions = await prisma.trainingSession.findMany({
    where: isAdmin ? {} : { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { title, details, accentColor, signupUrl, isPublished } = await req.json();
  if (!title || !details) return NextResponse.json({ error: "Titre et détails requis." }, { status: 400 });

  const created = await prisma.trainingSession.create({
    data: {
      title,
      details,
      accentColor: accentColor || null,
      signupUrl: signupUrl || null,
      isPublished: isPublished ?? true,
    },
  });

  return NextResponse.json(created, { status: 201 });
}

