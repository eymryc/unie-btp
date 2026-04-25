import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import AdminShell from "./AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") redirect("/membre/dashboard");

  return <AdminShell role={session.role}>{children}</AdminShell>;
}
