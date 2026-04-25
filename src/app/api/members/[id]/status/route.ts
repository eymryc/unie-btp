import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { id } = await params;
  const { subscriptionStatus, subscriptionExpiry } = await req.json();

  const validStatuses = ["PENDING", "ACTIVE", "EXPIRED", "SUSPENDED"];
  if (!validStatuses.includes(subscriptionStatus)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const company = await prisma.company.update({
    where: { userId: id },
    data: {
      subscriptionStatus,
      subscriptionExpiry: subscriptionExpiry ? new Date(subscriptionExpiry) : null,
    },
  });

  return NextResponse.json({ success: true, subscriptionStatus: company.subscriptionStatus });
}
