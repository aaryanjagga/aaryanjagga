import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import HeroBackground from '../../components/common/HeroBackground';
import SectionHeading from '../../components/common/SectionHeading';
import ProjectCard from '../../components/public/ProjectCard';
import ProjectModal from '../../components/public/ProjectModal';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

export default function ProjectsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProject, setActiveModalProject] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadProjectsData = async () => {
      try {
        const res = await api.getPortfolio();
        if (isMounted) {
          setData(res);
          document.title = `Projects — ${res.profile?.full_name || 'Aaryan Jagga'}`;

          // If route is /projects/:slug, auto-open the corresponding project
          if (slug && res.projects) {
            const found = res.projects.find((p) => p.slug === slug);
            if (found) setActiveModalProject(found);
          }
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProjectsData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const projects = data?.projects || [];

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(q) ||
        p.short_desc.toLowerCase().includes(q) ||
        (p.technologies && p.technologies.some((t) => t.toLowerCase().includes(q)));
      return matchCat && matchSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  const handleOpenModal = (project) => {
    setActiveModalProject(project);
    navigate(`/projects/${project.slug}`, { replace: true });
  };

  const handleCloseModal = () => {
    setActiveModalProject(null);
    navigate('/projects', { replace: true });
  };

  return (
    <div className="min-h-screen relative selection:bg-indigo-500/30 selection:text-indigo-200">
      <HeroBackground />
      <Navbar profile={data?.profile} />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Home
            </Button>
          </div>

          <SectionHeading
            badge="Portfolio Catalog"
            title="All Software Engineering Projects"
            subtitle="Deep dive into all open-source projects, SaaS platforms, and technical visualizers built by Aaryan Jagga."
            align="left"
          />

          {/* Filters & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl glass-panel">
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

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, tech or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-900/60 border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          </div>

          {/* Projects Listing */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 rounded-2xl glass-panel p-4 space-y-4">
                  <Skeleton className="h-36 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                >
                  <ProjectCard project={p} onSelect={handleOpenModal} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <p className="text-sm">No projects matching your search criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs text-indigo-400 hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </main>

      <ProjectModal
        project={activeModalProject}
        isOpen={!!activeModalProject}
        onClose={handleCloseModal}
      />

      <Footer
        profile={data?.profile}
        socialLinks={data?.social_links}
        siteSettings={data?.site_settings}
      />
    </div>
  );
}
