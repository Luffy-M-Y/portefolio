import sql from "@/lib/db";
import { notFound } from "next/navigation";
import type { Project } from "@/components/ProjectCard";
import { GitBranch, ExternalLink, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match?.[1] ?? null;
}

function isYouTube(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project] = await sql`SELECT * FROM projects WHERE id = ${id}` as Project[];
  if (!project) notFound();

  const media: string[] = project.media ?? [];

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center">
          <Link href="/#projects" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              project.status === "completed"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
            }`}>
              {project.status === "completed" ? "Terminé" : "En cours"}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
              {project.type === "personal" ? "Personnel" : "Académique"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">{project.title}</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">{project.description}</p>

          <div className="flex flex-wrap gap-3 mt-6">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity">
                <GitBranch className="w-4 h-4" /> Voir le code
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                <ExternalLink className="w-4 h-4" /> Voir la démo
              </a>
            )}
          </div>
        </div>

        {/* Image de couverture */}
        {project.image_url && (
          <div className="rounded-2xl overflow-hidden mb-10 border border-neutral-100 dark:border-neutral-800 shadow-lg">
            <img src={project.image_url} alt={project.title} className="w-full object-cover max-h-[500px]" />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            {project.long_description && (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">À propos du projet</h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">{project.long_description}</p>
              </div>
            )}

            {/* Galerie médias */}
            {media.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Galerie</h2>
                <div className="space-y-4">
                  {media.map((url, i) =>
                    isYouTube(url) ? (
                      <div key={i} className="rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(url)}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div key={i} className="rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow">
                        <img src={url} alt={`${project.title} - ${i + 1}`} className="w-full object-cover" />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Informations</h3>
              <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{new Date(project.created_at!).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
