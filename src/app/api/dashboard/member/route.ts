import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const [
    savedCount,
    interestedCount,
    collaborationsCount,
    submissionsCount,
    recentOpps,
    myCollabs,
  ] = await Promise.all([
    prisma.savedOpportunity.count({ where: { userId: session.userId } }),
    prisma.opportunityInterest.count({ where: { userId: session.userId } }),
    prisma.collaborationMember.count({ where: { userId: session.userId } }),
    prisma.submission.count({ where: { userId: session.userId } }),
    prisma.opportunity.findMany({
      where: { isPublished: true },
      orderBy: { closingDate: "asc" },
      take: 5,
      include: {
        _count: { select: { interests: true } },
        saved: { where: { userId: session.userId }, select: { id: true } },
        interests: { where: { userId: session.userId }, select: { id: true } },
      },
    }),
    prisma.collaborationMember.findMany({
      where: { userId: session.userId },
      include: {
        collaboration: {
          include: { _count: { select: { members: true } } },
        },
      },
      take: 3,
    }),
  ]);

  return NextResponse.json({
    savedCount,
    interestedCount,
    collaborationsCount,
    submissionsCount,
    opportunitiesCount: await prisma.opportunity.count({ where: { isPublished: true } }),
    recentOpportunities: recentOpps.map((o) => ({
      id: o.id,
      title: o.title,
      funder: o.funder,
      sector: o.sector,
      complexity: o.complexity,
      closingDate: o.closingDate.toISOString(),
      interestCount: o._count.interests,
      isSaved: o.saved.length > 0,
      isInterested: o.interests.length > 0,
    })),
    myCollaborations: myCollabs.map((cm) => ({
      id: cm.collaboration.id,
      title: cm.collaboration.title,
      status: cm.collaboration.status,
      memberCount: cm.collaboration._count.members,
    })),
  });
}
