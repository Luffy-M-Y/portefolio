import sql from "@/lib/db";
import { initDB } from "@/lib/db";
import HomeClient from "./HomeClient";
import type { Project } from "@/components/ProjectCard";

export const revalidate = 0;

export type Skill = { id: number; domain: string; name: string; level: string };

export default async function Home() {
  await initDB();
  const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC` as Project[];
  const skills = await sql`SELECT * FROM skills ORDER BY domain, id` as Skill[];

  // Seed skills si vide
  if (skills.length === 0) {
    await sql`INSERT INTO skills (domain, name, level) VALUES
      ('Langages', 'HTML5', 'Avancé'),
      ('Langages', 'CSS3', 'Avancé'),
      ('Langages', 'JavaScript', 'Intermédiaire'),
      ('Langages', 'Python', 'Intermédiaire'),
      ('Langages', 'C', 'Débutant'),
      ('Frameworks', 'Flask', 'Intermédiaire'),
      ('Développement Web', 'WordPress', 'Intermédiaire'),
      ('Développement Web', 'Responsive Design', 'Intermédiaire'),
      ('Bases de données', 'MySQL', 'Débutant'),
      ('Outils', 'Git', 'Intermédiaire'),
      ('Outils', 'GitHub', 'Intermédiaire'),
      ('Outils', 'Visual Studio Code', 'Intermédiaire'),
      ('Outils', 'Linux', 'Débutant')
    `;
    const seeded = await sql`SELECT * FROM skills ORDER BY domain, id` as Skill[];
    return <HomeClient projects={projects} skills={seeded} />;
  }

  return <HomeClient projects={projects} skills={skills} />;
}
