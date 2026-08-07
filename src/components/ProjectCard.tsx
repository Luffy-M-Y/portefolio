"use client";
import { motion } from "framer-motion";
import { GitBranch, ExternalLink, Code2 } from "lucide-react";

export type Project = {
  id: number;
  title: string;
  description: string;
  long_description?: string;
  technologies: string[];
  image_url?: string;
  github_url?: string;
  demo_url?: string;
  status: string;
  type: string;
};

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-neutral-100 dark:border-neutral-800"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 overflow-hidden">
        {project.image_url ? (
          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Code2 className="w-16 h-16 text-indigo-300 dark:text-indigo-700" />
          </div>
        )}
        <span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${
          project.status === "completed"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
            : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
        }`}>
          {project.status === "completed" ? "Terminé" : "En cours"}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white leading-tight">{project.title}</h3>
          <span className="shrink-0 text-xs text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
            {project.type === "personal" ? "Personnel" : "Académique"}
          </span>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4 line-clamp-3">{project.description}</p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.technologies.map((tech) => (
            <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium">
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <GitBranch className="w-4 h-4" /> Code
            </a>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <ExternalLink className="w-4 h-4" /> Démo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
