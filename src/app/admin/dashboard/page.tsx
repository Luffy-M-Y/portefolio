"use client";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Plus, Pencil, Trash2, LogOut, ExternalLink, LayoutDashboard } from "lucide-react";
import ProjectForm from "@/components/ProjectForm";
import type { Project } from "@/components/ProjectCard";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modal, setModal] = useState<{ open: boolean; project?: Project }>({ open: false });
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    setProjects(await res.json());
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (data: Partial<Project>) => {
    if (modal.project?.id) {
      await fetch(`/api/projects/${modal.project.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } else {
      await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    setModal({ open: false });
    fetchProjects();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce projet ?")) return;
    setDeleting(id);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setDeleting(null);
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-neutral-900 dark:text-white text-sm">Dashboard</h1>
              <p className="text-xs text-neutral-400">Gestion des projets</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-indigo-600 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Voir le site
            </a>
            <button onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-red-500 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total projets", value: projects.length },
            { label: "Terminés", value: projects.filter((p) => p.status === "completed").length },
            { label: "En cours", value: projects.filter((p) => p.status === "in-progress").length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-100 dark:border-neutral-800">
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Projects list */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="font-semibold text-neutral-900 dark:text-white">Projets</h2>
            <button onClick={() => setModal({ open: true })}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">
              <p className="text-sm">Aucun projet pour l&apos;instant.</p>
              <button onClick={() => setModal({ open: true })} className="mt-3 text-sm text-indigo-600 hover:underline">
                Ajouter votre premier projet →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0 text-indigo-400 font-bold text-lg">
                      {project.title[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 dark:text-white text-sm truncate">{project.title}</p>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{project.description}</p>
                    <div className="flex gap-1.5 mt-1.5">
                      {project.technologies.slice(0, 3).map((t) => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">{t}</span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs text-neutral-400">+{project.technologies.length - 3}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      project.status === "completed"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    }`}>
                      {project.status === "completed" ? "Terminé" : "En cours"}
                    </span>
                    <button onClick={() => setModal({ open: true, project })}
                      className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(project.id)} disabled={deleting === project.id}
                      className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors disabled:opacity-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                {modal.project ? "Modifier le projet" : "Nouveau projet"}
              </h3>
              <button onClick={() => setModal({ open: false })} className="text-neutral-400 hover:text-neutral-600 text-xl leading-none">×</button>
            </div>
            <div className="p-6">
              <ProjectForm initial={modal.project} onSubmit={handleSubmit} onCancel={() => setModal({ open: false })} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
