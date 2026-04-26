import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isMemberPath = pathname.startsWith("/membre");
  const isAdminPath = pathname.startsWith("/admin");

  if (!isMemberPath && !isAdminPath) return NextResponse.next();

  const session = await getRequestSession(req);

  // Non connecté → login
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Routes admin → rôle admin requis
  if (isAdminPath && session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/membre/dashboard", req.url));
  }

  // Membres PENDING → accès limité (seulement attente + profil)
  if (isMemberPath && session.subscriptionStatus === "PENDING") {
    const allowed = ["/membre/attente", "/membre/profil"];
    const isAllowed = allowed.some((p) => pathname.startsWith(p));
    if (!isAllowed) {
      return NextResponse.redirect(new URL("/membre/attente", req.url));
    }
  }

  // Membres SUSPENDED → profil uniquement
  if (isMemberPath && session.subscriptionStatus === "SUSPENDED") {
    const allowed = ["/membre/attente", "/membre/profil"];
    const isAllowed = allowed.some((p) => pathname.startsWith(p));
    if (!isAllowed) {
      return NextResponse.redirect(new URL("/membre/attente?suspended=1", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/membre/:path*", "/admin/:path*"],
};
