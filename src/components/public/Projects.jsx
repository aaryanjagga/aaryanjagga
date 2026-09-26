import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Layers } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import Button from '../ui/Button';

export default function Projects({ projects = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState(null);

  // Derive categories dynamically
  const categories = useMemo(() => {
    if (!projects || projects.length === 0) return ['All'];
    const set = new Set(projects.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  if (!projects || projects.length === 0) return null;

  // Show up to 6 on homepage
  const displayedProjects = filteredProjects.slice(0, 6);

  return (
    <section id="projects" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          badge="Featured Projects"
          title="Digital products engineered for the real world."
          subtitle="Explore selected SaaS applications, algorithmic visualizers, developer tools, and full-stack systems."
        />

        {/* Category Filters */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-2xl glass-panel">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <ProjectCard project={project} onSelect={setActiveModalProject} />
            </motion.div>
          ))}
        </div>

        {/* View All Projects CTA */}
        {projects.length > 6 && (
          <div className="mt-12 text-center">
            <Link to="/projects">
              <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All {projects.length} Projects
              </Button>
            </Link>
          </div>
        )}

        {/* Project Modal */}
        <ProjectModal
          project={activeModalProject}
          isOpen={!!activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      </div>
    </section>
  );
}
