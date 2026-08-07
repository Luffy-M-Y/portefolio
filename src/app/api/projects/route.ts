import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const body = await req.json();
    const { title, description, long_description, technologies, image_url, media, github_url, demo_url, status, type } = body;
    const [project] = await sql`
      INSERT INTO projects (title, description, long_description, technologies, image_url, media, github_url, demo_url, status, type)
      VALUES (${title}, ${description}, ${long_description}, ${technologies}, ${image_url}, ${media ?? []}, ${github_url}, ${demo_url}, ${status}, ${type})
      RETURNING *
    `;
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
