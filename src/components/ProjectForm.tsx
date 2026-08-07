"use client";
import { useState } from "react";
import { X, Upload } from "lucide-react";
import type { Project } from "./ProjectCard";

type ProjectFormProps = {
  initial?: Partial<Project>;
  onSubmit: (data: Partial<Project>) => Promise<void>;
  onCancel: () => void;
};

const TECH_SUGGESTIONS = ["Python", "Flask", "HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"];

export default function ProjectForm({ initial, onSubmit, onCancel }: ProjectFormProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    long_description: initial?.long_description ?? "",
    technologies: initial?.technologies ?? [] as string[],
    image_url: initial?.image_url ?? "",
    github_url: initial?.github_url ?? "",
    demo_url: initial?.demo_url ?? "",
    status: initial?.status ?? "completed",
    type: initial?.type ?? "personal",
  });
  const [techInput, setTechInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const addTech = (tech: string) => {
    const t = tech.trim();
    if (t && !form.technologies.includes(t)) {
      setForm((f) => ({ ...f, technologies: [...f.technologies, t] }));
    }
    setTechInput("");
  };

  const removeTech = (tech: string) => setForm((f) => ({ ...f, technologies: f.technologies.filter((t) => t !== tech) }));

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await fetch("/api/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ base64: reader.result }) });
      const data = await res.json();
      setForm((f) => ({ ...f, image_url: data.url }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Titre *</label>
          <input required className={inputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Type</label>
            <select className={inputClass} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              <option value="personal">Personnel</option>
              <option value="academic">Académique</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Statut</label>
            <select className={inputClass} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <option value="completed">Terminé</option>
              <option value="in-progress">En cours</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Description courte *</label>
        <textarea required rows={2} className={inputClass} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Description complète</label>
        <textarea rows={4} className={inputClass} value={form.long_description} onChange={(e) => setForm((f) => ({ ...f, long_description: e.target.value }))} />
      </div>

      {/* Technologies */}
      <div>
        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Technologies</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.technologies.map((t) => (
            <span key={t} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
              {t} <button type="button" onClick={() => removeTech(t)}><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={inputClass} placeholder="Ajouter une techno..." value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(techInput); } }} />
          <button type="button" onClick={() => addTech(techInput)} className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">+</button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {TECH_SUGGESTIONS.filter((t) => !form.technologies.includes(t)).map((t) => (
            <button key={t} type="button" onClick={() => addTech(t)} className="text-xs px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
              + {t}
            </button>
          ))}
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Image du projet</label>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
            <Upload className="w-4 h-4 text-neutral-400" />
            {uploading ? "Upload en cours..." : "Choisir une image"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
          {form.image_url && <img src={form.image_url} alt="preview" className="h-12 w-20 object-cover rounded-lg" />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Lien GitHub</label>
          <input type="url" className={inputClass} value={form.github_url} onChange={(e) => setForm((f) => ({ ...f, github_url: e.target.value }))} placeholder="https://github.com/..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Lien Démo</label>
          <input type="url" className={inputClass} value={form.demo_url} onChange={(e) => setForm((f) => ({ ...f, demo_url: e.target.value }))} placeholder="https://..." />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
          Annuler
        </button>
        <button type="submit" disabled={loading || uploading} className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {loading ? "Enregistrement..." : initial?.id ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}
