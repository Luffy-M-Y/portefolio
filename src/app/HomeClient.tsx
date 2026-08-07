"use client";
import { motion } from "framer-motion";
import { GitBranch, Mail, MapPin, GraduationCap, Code2, Sparkles } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/components/ProjectCard";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

export default function HomeClient({ projects }: { projects: Project[] }) {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">PM.</span>
          <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
            <a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">À propos</a>
            <a href="#projects" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Projets</a>
            <a href="#contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Disponible pour des opportunités
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4 leading-none">
            P. Manassé<br />
            <span className="text-indigo-600 dark:text-indigo-400">YAMEOGO</span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed mb-8">
            Informaticien en formation en Licence de Développement Web à l&apos;ISCOM, passionné par le développement logiciel et la conception de solutions numériques.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap items-center gap-4">
            <a href="#projects"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
              Voir mes projets
            </a>
            <a href="#contact"
              className="px-6 py-3 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Me contacter
            </a>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6 bg-white dark:bg-neutral-900">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-3xl font-bold text-neutral-900 dark:text-white mb-12">
            À propos
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                Étudiant en informatique à l&apos;ISCOM, je me spécialise dans le développement web et logiciel. 
                Curieux et autodidacte, j&apos;aime construire des outils concrets qui résolvent de vrais problèmes.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Chaque projet est pour moi une occasion d&apos;apprendre, d&apos;expérimenter et de progresser — 
                que ce soit en back-end, en front-end ou en administration système.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
              className="space-y-4">
              {[
                { icon: GraduationCap, label: "Formation", value: "Licence Développement Web — ISCOM" },
                { icon: MapPin, label: "Localisation", value: "Burkina Faso" },
                { icon: Code2, label: "Spécialité", value: "Développement Web & Logiciel" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">{label}</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">Mes projets</h2>
            <p className="text-neutral-500 dark:text-neutral-400">Ce que j&apos;ai construit jusqu&apos;ici.</p>
          </motion.div>

          {projects.length === 0 ? (
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-center py-20 text-neutral-400 dark:text-neutral-600">
              <Code2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Les projets arrivent bientôt...</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 bg-white dark:bg-neutral-900">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Travaillons ensemble</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto">
              Vous avez un projet, une idée, ou juste envie d&apos;échanger ? Je suis disponible.
            </p>
            <div className="flex justify-center gap-4">
              <a href="mailto:contact@example.com"
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                <Mail className="w-4 h-4" /> M&apos;écrire
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <GitBranch className="w-4 h-4" /> GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-neutral-100 dark:border-neutral-800 text-center text-sm text-neutral-400 dark:text-neutral-600">
        © {new Date().getFullYear()} P. Manassé YAMEOGO — Fait avec passion
      </footer>
    </main>
  );
}
