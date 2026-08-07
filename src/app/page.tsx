import sql from "@/lib/db";
import { initDB } from "@/lib/db";
import HomeClient from "./HomeClient";
import type { Project } from "@/components/ProjectCard";

export const revalidate = 0;

export default async function Home() {
  await initDB();
  const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC` as Project[];
  return <HomeClient projects={projects} />;
}
