import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const items = await sql`SELECT * FROM timeline ORDER BY category, sort_order, id`;
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const { category, title, subtitle, year, sort_order } = await req.json();
    const [item] = await sql`INSERT INTO timeline (category, title, subtitle, year, sort_order) VALUES (${category}, ${title}, ${subtitle}, ${year}, ${sort_order ?? 0}) RETURNING *`;
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
