"use client";
import { motion } from "framer-motion";
import { GitBranch, Mail, MapPin, GraduationCap, ArrowRight, ExternalLink } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/components/ProjectCard";
import type { Skill } from "./page";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } },
});

const LEVEL_CONFIG = {
  "Avancé":        { pct: "100%", color: "bg-white",      label: "Avancé" },
  "Intermédiaire": { pct: "66%",  color: "bg-white/60",  label: "Intermédiaire" },
  "Débutant":      { pct: "33%",  color: "bg-white/30",  label: "Débutant" },
} as const;

export default function HomeClient({ projects, skills }: { projects: Project[]; skills: Skill[] }) {
  const domains = Array.from(new Set(skills.map((s) => s.domain)));
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0f0f0f]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-medium text-white/80 tracking-widest uppercase">Manassé</span>
          <div className="flex items-center gap-8 text-sm text-white/60">
            <a href="#about" className="hover:text-white transition-colors">À propos</a>
            <a href="#projects" className="hover:text-white transition-colors">Projets</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center px-6 pt-14">
        <div className="max-w-5xl mx-auto w-full">
          <motion.p {...fade(0.1)} className="text-sm text-white/50 mb-6 tracking-widest uppercase">
            Bonjour, je suis
          </motion.p>

          <motion.h1 {...fade(0.2)} className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-6">
            P. Manassé<br />
            <span className="text-white/40">YAMEOGO</span>
          </motion.h1>

          <motion.p {...fade(0.35)} className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed mb-10">
            J&apos;apprends, je construis, je casse, je recommence —
            étudiant en développement web à l&apos;ISCOM, Burkina Faso.
          </motion.p>

          <motion.div {...fade(0.45)} className="flex flex-wrap gap-4">
            <a href="#projects"
              className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors">
              Voir mes projets
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact"
              className="flex items-center gap-2 px-6 py-3 border border-white/10 text-white/60 rounded-full text-sm hover:border-white/30 hover:text-white transition-colors">
              Me contacter
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div {...fade(0.8)} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-xs text-white/20 tracking-widest uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <p className="text-xs text-white/50 tracking-widest uppercase mb-6">À propos</p>
              <h2 className="text-3xl font-bold text-white mb-6 leading-snug">
                Un étudiant qui construit<br />des choses concrètes.
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                Je suis en Licence de Développement Web à l&apos;ISCOM. Je ne me contente pas des cours —
                chaque projet est une occasion de tester quelque chose de réel.
              </p>
              <p className="text-white/70 leading-relaxed">
                Back-end, front-end, bases de données, déploiement — j&apos;aime comprendre comment les pièces s&apos;assemblent.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-3">
              {[
                { icon: GraduationCap, label: "Licence Développement Web", sub: "ISCOM" },
                { icon: MapPin, label: "Burkina Faso", sub: "Afrique de l'Ouest" },
                { icon: GitBranch, label: "Web & Logiciel", sub: "Spécialité" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white/40" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80 font-medium">{label}</p>
                    <p className="text-xs text-white/50">{sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs text-white/50 tracking-widest uppercase mb-4">Compétences</p>
            <h2 className="text-3xl font-bold text-white">Ce que je sais faire.</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {domains.map((domain, di) => (
              <motion.div key={domain}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: di * 0.08 }}>
                <p className="text-xs text-white/50 tracking-widest uppercase mb-5">{domain}</p>
                <div className="space-y-4">
                  {skills.filter((s) => s.domain === domain).map((skill) => {
                    const cfg = LEVEL_CONFIG[skill.level as keyof typeof LEVEL_CONFIG] ?? LEVEL_CONFIG["Débutant"];
                    return (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-white/85">{skill.name}</span>
                          <span className="text-xs text-white/50">{cfg.label}</span>
                        </div>
                        <div className="h-px bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${cfg.color} rounded-full`}
                            initial={{ width: 0 }}
                            whileInView={{ width: cfg.pct }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs text-white/50 tracking-widest uppercase mb-4">Projets</p>
            <h2 className="text-3xl font-bold text-white">Ce que j&apos;ai construit.</h2>
          </motion.div>

          {projects.length === 0 ? (
            <p className="text-white/20 text-sm">Les projets arrivent bientôt...</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="text-xs text-white/50 tracking-widest uppercase mb-6">Contact</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Vous avez un projet ?<br />
              <span className="text-white/40">Parlons-en.</span>
            </h2>
            <p className="text-white/60 mb-10 max-w-md leading-relaxed">
              Que ce soit pour collaborer, poser une question ou juste échanger — je réponds.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:manassey05@gmail.com"
                className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors">
                <Mail className="w-4 h-4" /> manassey05@gmail.com
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-white/10 text-white/60 rounded-full text-sm hover:border-white/30 hover:text-white transition-colors">
                <ExternalLink className="w-4 h-4" /> GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-white/20">
          <span>© {new Date().getFullYear()} P. Manassé YAMEOGO</span>
          <span>Burkina Faso</span>
        </div>
      </footer>
    </main>
  );
}
