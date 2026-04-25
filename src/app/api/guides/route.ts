import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const guides = await prisma.guide.findMany({
    where: { isPublished: true },
    orderBy: { category: "asc" },
  });

  return NextResponse.json(guides);
}
