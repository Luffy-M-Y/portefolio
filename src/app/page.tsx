import sql from "@/lib/db";
import { initDB } from "@/lib/db";
import HomeClient from "./HomeClient";
import type { Project } from "@/components/ProjectCard";

export const revalidate = 0;

export type Skill = { id: number; domain: string; name: string; level: string };
export type TimelineItem = { id: number; category: string; title: string; subtitle?: string; year?: string; sort_order: number };
export type Settings = { cv_url?: string };

const SEED_TIMELINE = [
  { category: "Formation", title: "Licence en Développement Web", subtitle: "ISCOM", year: "2025 – aujourd'hui", sort_order: 0 },
  { category: "Formation", title: "Baccalauréat Série H – Informatique", subtitle: "LTN", year: "2025", sort_order: 1 },
  { category: "Formation", title: "BEP Informatique", subtitle: "LTN", year: "2025", sort_order: 2 },
  { category: "Formation", title: "Certification en informatique bureautique", subtitle: null, year: "2023", sort_order: 3 },
  { category: "Expérience", title: "Bénévole – Service Audiovisuel & Informatique", subtitle: "Communauté Évangélique de Yamtenga · Installation matériel, OBS Studio, vMix, Réseau, Dépannage", year: null, sort_order: 0 },
  { category: "Langues", title: "Français", subtitle: "Courant", year: null, sort_order: 0 },
  { category: "Langues", title: "Mooré", subtitle: "Langue maternelle", year: null, sort_order: 1 },
  { category: "Langues", title: "Anglais", subtitle: "Notions", year: null, sort_order: 2 },
];

export default async function Home() {
  await initDB();
  const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC` as Project[];
  const skills = await sql`SELECT * FROM skills ORDER BY domain, id` as Skill[];
  let timeline = await sql`SELECT * FROM timeline ORDER BY category, sort_order, id` as TimelineItem[];

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
  }

  if (timeline.length === 0) {
    for (const item of SEED_TIMELINE) {
      await sql`INSERT INTO timeline (category, title, subtitle, year, sort_order) VALUES (${item.category}, ${item.title}, ${item.subtitle}, ${item.year}, ${item.sort_order})`;
    }
    timeline = await sql`SELECT * FROM timeline ORDER BY category, sort_order, id` as TimelineItem[];
  }

  const seededSkills = skills.length === 0
    ? await sql`SELECT * FROM skills ORDER BY domain, id` as Skill[]
    : skills;

  const settingsRows = await sql`SELECT * FROM settings`;
  const settings: Settings = Object.fromEntries(settingsRows.map((r: { key: string; value: string }) => [r.key, r.value]));

  return <HomeClient projects={projects} skills={seededSkills} timeline={timeline} settings={settings} />;
}
