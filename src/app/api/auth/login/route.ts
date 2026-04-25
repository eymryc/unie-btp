import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken, createAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: { select: { subscriptionStatus: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionStatus: user.company?.subscriptionStatus ?? "PENDING",
    });

    const cookie = createAuthCookie(token);
    const res = NextResponse.json({
      success: true,
      role: user.role,
      subscriptionStatus: user.company?.subscriptionStatus ?? "PENDING",
    });
    res.cookies.set(cookie);
    return res;
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
