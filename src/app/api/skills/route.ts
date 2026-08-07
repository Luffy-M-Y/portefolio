import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const skills = await sql`SELECT * FROM skills ORDER BY domain, id`;
    return NextResponse.json(skills);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const { domain, name, level } = await req.json();
    const [skill] = await sql`INSERT INTO skills (domain, name, level) VALUES (${domain}, ${name}, ${level}) RETURNING *`;
    return NextResponse.json(skill, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
