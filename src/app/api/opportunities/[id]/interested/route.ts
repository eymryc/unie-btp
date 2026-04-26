import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;

  const interests = await prisma.opportunityInterest.findMany({
    where: { opportunityId: id },
    include: {
      user: {
        include: {
          company: {
            select: { name: true, sector: true, city: true, specialties: true, geographicZone: true, availability: true },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    interests.map((i) => ({
      userId: i.userId,
      level: i.level,
      companyName: i.user.company?.name ?? i.user.email,
      sector: i.user.company?.sector ?? "",
      city: i.user.company?.city ?? "",
      specialties: i.user.company?.specialties ?? null,
      availability: i.user.company?.availability ?? null,
      createdAt: i.createdAt.toISOString(),
    }))
  );
}
