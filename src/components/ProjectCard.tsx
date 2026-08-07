"use client";
import { motion } from "framer-motion";
import { GitBranch, ExternalLink, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export type Project = {
  id: number;
  title: string;
  description: string;
  long_description?: string;
  technologies: string[];
  image_url?: string;
  media?: string[];
  github_url?: string;
  demo_url?: string;
  status: string;
  type: string;
  created_at?: string;
};

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300"
    >
      {/* Image */}
      <Link href={`/projects/${project.id}`} className="block relative h-52 overflow-hidden bg-white/[0.02]">
        {project.image_url ? (
          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-5xl font-bold text-white/5">{project.title[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/60 to-transparent" />
        <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-medium ${
          project.status === "completed"
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
        }`}>
          {project.status === "completed" ? "Terminé" : "En cours"}
        </span>
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/projects/${project.id}`}>
            <h3 className="font-semibold text-white/90 group-hover:text-white transition-colors leading-snug flex items-center gap-1">
              {project.title}
              <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
            </h3>
          </Link>
          <span className="shrink-0 text-xs text-white/20 border border-white/5 px-2 py-0.5 rounded-full">
            {project.type === "personal" ? "Personnel" : "Académique"}
          </span>
        </div>

        <p className="text-sm text-white/40 leading-relaxed mb-4 line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.map((tech) => (
            <span key={tech} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4 pt-3 border-t border-white/5">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors">
              <GitBranch className="w-3.5 h-3.5" /> Code
            </a>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Démo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
