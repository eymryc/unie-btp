import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/login"];
const MEMBER_PATHS = ["/membre"];
const ADMIN_PATHS = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isMemberPath = MEMBER_PATHS.some((p) => pathname.startsWith(p));
  const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));

  if (!isMemberPath && !isAdminPath) return NextResponse.next();

  const session = await getRequestSession(req);

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminPath && session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/membre/dashboard", req.url));
  }

  if (isMemberPath && session.subscriptionStatus === "SUSPENDED") {
    if (!pathname.startsWith("/membre/profil")) {
      return NextResponse.redirect(new URL("/membre/profil", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/membre/:path*", "/admin/:path*"],
};
