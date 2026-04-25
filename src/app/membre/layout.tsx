import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PlatformShell from "./PlatformShell";

export default async function MembreLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const company = await prisma.company.findUnique({
    where: { userId: session.userId },
    select: { name: true, subscriptionStatus: true, subscriptionExpiry: true },
  });

  return (
    <PlatformShell
      role={session.role}
      companyName={company?.name}
      subscriptionStatus={company?.subscriptionStatus}
      subscriptionExpiry={company?.subscriptionExpiry?.toISOString() ?? null}
    >
      {children}
    </PlatformShell>
  );
}
