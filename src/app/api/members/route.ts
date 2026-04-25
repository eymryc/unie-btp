import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { role: "MEMBER" },
    orderBy: { createdAt: "desc" },
    include: {
      company: {
        select: {
          id: true, name: true, sector: true, city: true,
          subscriptionStatus: true, subscriptionExpiry: true,
        },
      },
    },
  });

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
      company: u.company
        ? { ...u.company, subscriptionExpiry: u.company.subscriptionExpiry?.toISOString() ?? null }
        : null,
    }))
  );
}
