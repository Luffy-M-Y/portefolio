import sql from "@/lib/db";
import { notFound } from "next/navigation";
import type { Project } from "@/components/ProjectCard";
import { GitBranch, ExternalLink, ArrowLeft } from "lucide-react";
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
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0f0f0f]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center">
          <Link href="/#projects" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-24">

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
              project.status === "completed"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}>
              {project.status === "completed" ? "Terminé" : "En cours"}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full border border-white/5 text-white/30">
              {project.type === "personal" ? "Personnel" : "Académique"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-none mb-5">{project.title}</h1>
          <p className="text-lg text-white/50 leading-relaxed max-w-2xl">{project.description}</p>

          <div className="flex flex-wrap gap-3 mt-8">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors">
                <GitBranch className="w-4 h-4" /> Voir le code
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-white/60 rounded-full text-sm hover:border-white/30 hover:text-white transition-colors">
                <ExternalLink className="w-4 h-4" /> Voir la démo
              </a>
            )}
          </div>
        </div>

        {/* Image de couverture */}
        {project.image_url && (
          <div className="rounded-2xl overflow-hidden mb-16 border border-white/5">
            <img src={project.image_url} alt={project.title} className="w-full object-cover max-h-[520px]" />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">

            {/* Description */}
            {project.long_description && (
              <div>
                <p className="text-xs text-white/20 tracking-widest uppercase mb-4">À propos</p>
                <p className="text-white/60 leading-relaxed whitespace-pre-line text-[15px]">{project.long_description}</p>
              </div>
            )}

            {/* Galerie */}
            {media.length > 0 && (
              <div>
                <p className="text-xs text-white/20 tracking-widest uppercase mb-6">Galerie</p>
                <div className="space-y-5">
                  {media.map((url, i) =>
                    isYouTube(url) ? (
                      <div key={i} className="rounded-2xl overflow-hidden border border-white/5 aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(url)}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div key={i} className="rounded-2xl overflow-hidden border border-white/5">
                        <img src={url} alt={`${project.title} — ${i + 1}`} className="w-full object-cover" />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <p className="text-xs text-white/20 tracking-widest uppercase mb-4">Technologies</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/5">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <p className="text-xs text-white/20 tracking-widest uppercase mb-3">Date</p>
              <p className="text-sm text-white/40">
                {new Date(project.created_at!).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
