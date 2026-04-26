import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  try {
    const formData = await req.formData();
    const file    = formData.get("file") as File | null;
    const docType = formData.get("docType") as string ?? "autre";
    const name    = formData.get("name") as string ?? file?.name ?? "document";

    if (!file) return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop grand (max 5 Mo)." }, { status: 400 });
    }

    const company = await prisma.company.findUnique({ where: { userId: session.userId } });
    if (!company) return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext    = path.extname(file.name);
    const fname  = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const dir    = path.join(process.cwd(), "public", "uploads");

    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, fname), buffer);

    const doc = await prisma.companyDocument.create({
      data: {
        companyId: company.id,
        name,
        docType,
        fileName: file.name,
        fileUrl: `/uploads/${fname}`,
      },
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Erreur lors de l'upload." }, { status: 500 });
  }
}
