import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { company: true },
  });

  if (!user) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    role: user.role,
    company: user.company,
  });
}
