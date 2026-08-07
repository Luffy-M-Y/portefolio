"use client";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Plus, Pencil, Trash2, LogOut, ExternalLink, LayoutDashboard, X, Check, Download } from "lucide-react";
import ProjectForm from "@/components/ProjectForm";
import type { Project } from "@/components/ProjectCard";

type Skill = { id: number; domain: string; name: string; level: string };
type TimelineItem = { id: number; category: string; title: string; subtitle?: string; year?: string; sort_order: number };

const DOMAINS = ["Langages", "Frameworks", "Développement Web", "Bases de données", "Outils"];
const LEVELS = ["Débutant", "Intermédiaire", "Avancé"];
const CATEGORIES = ["Formation", "Expérience", "Langues"];

export default function DashboardPage() {
  const [tab, setTab] = useState<"projects" | "skills" | "timeline" | "settings">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [modal, setModal] = useState<{ open: boolean; project?: Project }>({ open: false });
  const [deleting, setDeleting] = useState<number | null>(null);
  const [newSkill, setNewSkill] = useState({ domain: DOMAINS[0], name: "", level: LEVELS[1] });
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newItem, setNewItem] = useState({ category: CATEGORIES[0], title: "", subtitle: "", year: "" });
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [cvUrl, setCvUrl] = useState("");
  const [cvUploading, setCvUploading] = useState(false);
  const [siteSettings, setSiteSettings] = useState({ bio: "", email: "", github_url: "", available: "true" });
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchProjects = async () => { const r = await fetch("/api/projects"); const d = await r.json(); setProjects(Array.isArray(d) ? d : []); };
  const fetchSkills = async () => { const r = await fetch("/api/skills"); const d = await r.json(); setSkills(Array.isArray(d) ? d : []); };
  const fetchTimeline = async () => { const r = await fetch("/api/timeline"); const d = await r.json(); setTimeline(Array.isArray(d) ? d : []); };
  const fetchSettings = async () => {
    const r = await fetch("/api/settings");
    const s = await r.json();
    if (s.error) return;
    setCvUrl(s.cv_url ?? "");
    setSiteSettings({
      bio: s.bio ?? "",
      email: s.email ?? "",
      github_url: s.github_url ?? "",
      available: s.available ?? "true",
    });
  };

  useEffect(() => { fetchProjects(); fetchSkills(); fetchTimeline(); fetchSettings(); }, []);

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

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return;
    await fetch("/api/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newSkill) });
    setNewSkill((s) => ({ ...s, name: "" }));
    fetchSkills();
  };

  const handleUpdateSkill = async () => {
    if (!editingSkill) return;
    await fetch(`/api/skills/${editingSkill.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingSkill) });
    setEditingSkill(null);
    fetchSkills();
  };

  const handleDeleteSkill = async (id: number) => {
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    fetchSkills();
  };

  const handleAddItem = async () => {
    if (!newItem.title.trim()) return;
    await fetch("/api/timeline", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newItem) });
    setNewItem((s) => ({ ...s, title: "", subtitle: "", year: "" }));
    fetchTimeline();
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    await fetch(`/api/timeline/${editingItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingItem) });
    setEditingItem(null);
    fetchTimeline();
  };

  const handleDeleteItem = async (id: number) => {
    await fetch(`/api/timeline/${id}`, { method: "DELETE" });
    fetchTimeline();
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ihtxsrjt");
    formData.append("public_id", "CV_Manasse_YAMEOGO");
    formData.append("resource_type", "raw");
    const res = await fetch("https://api.cloudinary.com/v1_1/injaxhrz/raw/upload", { method: "POST", body: formData });
    const data = await res.json();
    const url = data.secure_url;
    await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "cv_url", value: url }) });
    setCvUrl(url);
    setCvUploading(false);
  };

  const handleCvDelete = async () => {
    if (!confirm("Supprimer le CV ?")) return;
    await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "cv_url", value: "" }) });
    setCvUrl("");
  };

  const inputClass = "px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const domains = Array.from(new Set(skills.map((s) => s.domain)));
  const tlCategories = Array.from(new Set(timeline.map((t) => t.category)));

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-neutral-900 dark:text-white text-sm">Dashboard</h1>
              <p className="text-xs text-neutral-400">Gestion du portfolio</p>
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
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total projets", value: projects.length },
            { label: "Terminés", value: projects.filter((p) => p.status === "completed").length },
            { label: "Compétences", value: skills.length },
            { label: "Parcours", value: timeline.length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-100 dark:border-neutral-800">
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-1 w-fit">
          {(["projects", "skills", "timeline", "settings"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-indigo-600 text-white" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}>
              {t === "projects" ? "Projets" : t === "skills" ? "Compétences" : t === "timeline" ? "Parcours" : "Réglages"}
            </button>
          ))}
        </div>

        {/* Projects tab */}
        {tab === "projects" && (
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
                <button onClick={() => setModal({ open: true })} className="mt-3 text-sm text-indigo-600 hover:underline">Ajouter votre premier projet →</button>
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
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${project.status === "completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"}`}>
                        {project.status === "completed" ? "Terminé" : "En cours"}
                      </span>
                      <button onClick={() => setModal({ open: true, project })} className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(project.id)} disabled={deleting === project.id} className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors disabled:opacity-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skills tab */}
        {tab === "skills" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5">
              <h2 className="font-semibold text-neutral-900 dark:text-white mb-4">Ajouter une compétence</h2>
              <div className="flex flex-wrap gap-3">
                <select className={inputClass} value={newSkill.domain} onChange={(e) => setNewSkill((s) => ({ ...s, domain: e.target.value }))}>
                  {DOMAINS.map((d) => <option key={d}>{d}</option>)}
                </select>
                <input className={`${inputClass} flex-1 min-w-40`} placeholder="Nom (ex: React)" value={newSkill.name}
                  onChange={(e) => setNewSkill((s) => ({ ...s, name: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddSkill(); }} />
                <select className={inputClass} value={newSkill.level} onChange={(e) => setNewSkill((s) => ({ ...s, level: e.target.value }))}>
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
                <button onClick={handleAddSkill} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </div>
            </div>
            {domains.map((domain) => (
              <div key={domain} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                <div className="px-6 py-3 border-b border-neutral-100 dark:border-neutral-800">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{domain}</h3>
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {skills.filter((s) => s.domain === domain).map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between px-6 py-3">
                      {editingSkill?.id === skill.id ? (
                        <>
                          <div className="flex items-center gap-2 flex-1">
                            <select className={`${inputClass} text-xs py-1`} value={editingSkill.domain} onChange={(e) => setEditingSkill((s) => s ? { ...s, domain: e.target.value } : s)}>
                              {DOMAINS.map((d) => <option key={d}>{d}</option>)}
                            </select>
                            <input className={`${inputClass} flex-1 text-xs py-1`} value={editingSkill.name} onChange={(e) => setEditingSkill((s) => s ? { ...s, name: e.target.value } : s)} />
                            <select className={`${inputClass} text-xs py-1`} value={editingSkill.level} onChange={(e) => setEditingSkill((s) => s ? { ...s, level: e.target.value } : s)}>
                              {LEVELS.map((l) => <option key={l}>{l}</option>)}
                            </select>
                          </div>
                          <div className="flex items-center gap-1 ml-3">
                            <button onClick={handleUpdateSkill} className="p-1 text-emerald-500 hover:text-emerald-600"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingSkill(null)} className="p-1 text-neutral-300 hover:text-neutral-500"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-neutral-900 dark:text-white">{skill.name}</span>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${skill.level === "Avancé" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" : skill.level === "Intermédiaire" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"}`}>{skill.level}</span>
                            <button onClick={() => setEditingSkill(skill)} className="p-1 text-neutral-300 hover:text-indigo-500"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteSkill(skill.id)} className="p-1 text-neutral-300 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline tab */}
        {tab === "timeline" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5">
              <h2 className="font-semibold text-neutral-900 dark:text-white mb-4">Ajouter une étape</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select className={inputClass} value={newItem.category} onChange={(e) => setNewItem((s) => ({ ...s, category: e.target.value }))}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input className={inputClass} placeholder="Année (ex: 2025)" value={newItem.year} onChange={(e) => setNewItem((s) => ({ ...s, year: e.target.value }))} />
                <input className={`${inputClass} md:col-span-2`} placeholder="Titre *" value={newItem.title} onChange={(e) => setNewItem((s) => ({ ...s, title: e.target.value }))} />
                <input className={`${inputClass} md:col-span-2`} placeholder="Sous-titre / description" value={newItem.subtitle} onChange={(e) => setNewItem((s) => ({ ...s, subtitle: e.target.value }))} />
              </div>
              <button onClick={handleAddItem} className="mt-3 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            </div>

            {tlCategories.map((cat) => (
              <div key={cat} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                <div className="px-6 py-3 border-b border-neutral-100 dark:border-neutral-800">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{cat}</h3>
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {timeline.filter((t) => t.category === cat).map((item) => (
                    <div key={item.id} className="px-6 py-3">
                      {editingItem?.id === item.id ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <select className={`${inputClass} text-xs py-1`} value={editingItem.category} onChange={(e) => setEditingItem((s) => s ? { ...s, category: e.target.value } : s)}>
                              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                            </select>
                            <input className={`${inputClass} text-xs py-1`} placeholder="Année" value={editingItem.year ?? ""} onChange={(e) => setEditingItem((s) => s ? { ...s, year: e.target.value } : s)} />
                            <input className={`${inputClass} text-xs py-1 col-span-2`} placeholder="Titre" value={editingItem.title} onChange={(e) => setEditingItem((s) => s ? { ...s, title: e.target.value } : s)} />
                            <input className={`${inputClass} text-xs py-1 col-span-2`} placeholder="Sous-titre" value={editingItem.subtitle ?? ""} onChange={(e) => setEditingItem((s) => s ? { ...s, subtitle: e.target.value } : s)} />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={handleUpdateItem} className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded-lg text-xs hover:bg-emerald-600"><Check className="w-3 h-3" /> Sauvegarder</button>
                            <button onClick={() => setEditingItem(null)} className="px-3 py-1 text-xs text-neutral-400 hover:text-neutral-600">Annuler</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.title}</p>
                            {item.subtitle && <p className="text-xs text-neutral-400 mt-0.5">{item.subtitle}</p>}
                            {item.year && <p className="text-xs text-neutral-300 mt-0.5">{item.year}</p>}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => setEditingItem(item)} className="p-1 text-neutral-300 hover:text-indigo-500"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-neutral-300 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Settings tab */}
        {tab === "settings" && (
          <div className="space-y-6">
            {/* Infos du portfolio */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6">
              <h2 className="font-semibold text-neutral-900 dark:text-white mb-5">Informations du portfolio</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Bio (texte d&apos;accroche)</label>
                  <textarea rows={3} className={`${inputClass} w-full`} placeholder="J'apprends, je construis..." value={siteSettings.bio}
                    onChange={(e) => setSiteSettings((s) => ({ ...s, bio: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Email de contact</label>
                  <input type="email" className={`${inputClass} w-full`} placeholder="ton@email.com" value={siteSettings.email}
                    onChange={(e) => setSiteSettings((s) => ({ ...s, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Lien GitHub</label>
                  <input type="url" className={`${inputClass} w-full`} placeholder="https://github.com/..." value={siteSettings.github_url}
                    onChange={(e) => setSiteSettings((s) => ({ ...s, github_url: e.target.value }))} />
                </div>
                <button onClick={async () => {
                  setSavingSettings(true);
                  await Promise.all([
                    fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "bio", value: siteSettings.bio }) }),
                    fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "email", value: siteSettings.email }) }),
                    fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "github_url", value: siteSettings.github_url }) }),
                  ]);
                  setSavingSettings(false);
                }} disabled={savingSettings}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                  <Check className="w-4 h-4" /> {savingSettings ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </div>

            {/* CV */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6">
              <h2 className="font-semibold text-neutral-900 dark:text-white mb-5">CV téléchargeable</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl cursor-pointer hover:border-indigo-400 transition-colors w-fit">
                  <Download className="w-5 h-5 text-neutral-400" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {cvUploading ? "Upload en cours..." : "Choisir un fichier PDF"}
                  </span>
                  <input type="file" accept=".pdf" className="hidden" onChange={handleCvUpload} disabled={cvUploading} />
                </label>
                {cvUrl && (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 truncate flex-1">CV_Manasse_YAMEOGO.pdf</p>
                    <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline shrink-0">Voir</a>
                    <button onClick={handleCvDelete} className="text-xs text-red-400 hover:text-red-600 shrink-0">Supprimer</button>
                  </div>
                )}
                {!cvUrl && <p className="text-xs text-neutral-400">Aucun CV uploadé — le bouton n&apos;apparaîra pas sur le portfolio.</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-semibold text-neutral-900 dark:text-white">{modal.project ? "Modifier le projet" : "Nouveau projet"}</h3>
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
