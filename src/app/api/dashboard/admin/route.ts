import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const [
    totalMembers,
    activeMembers,
    pendingMembers,
    suspendedMembers,
    publishedOpportunities,
    totalInterests,
    totalCollaborations,
    companies,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.company.count({ where: { subscriptionStatus: "ACTIVE" } }),
    prisma.company.count({ where: { subscriptionStatus: "PENDING" } }),
    prisma.company.count({ where: { subscriptionStatus: "SUSPENDED" } }),
    prisma.opportunity.count({ where: { isPublished: true } }),
    prisma.opportunityInterest.count(),
    prisma.collaboration.count(),
    prisma.company.groupBy({ by: ["sector"], _count: { sector: true }, orderBy: { _count: { sector: "desc" } }, take: 6 }),
  ]);

  return NextResponse.json({
    totalMembers,
    activeMembers,
    pendingMembers,
    suspendedMembers,
    publishedOpportunities,
    totalInterests,
    totalCollaborations,
    sectorBreakdown: companies.map((c) => ({ sector: c.sector, count: c._count.sector })),
  });
}
