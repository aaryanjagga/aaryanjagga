import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight, Sparkles } from 'lucide-react';
import { GithubIcon } from '../common/SocialIcons';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function ProjectCard({ project, onSelect }) {
  const technologies = project.technologies || [];

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge variant="emerald" size="sm" dot>Completed</Badge>;
      case 'in progress':
        return <Badge variant="amber" size="sm" dot>In Progress</Badge>;
      case 'concept':
        return <Badge variant="indigo" size="sm" dot>Concept</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <Card className="hoverEffect group h-full flex flex-col justify-between overflow-hidden border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/40 transition-all duration-300">
      <div>
        {/* Project Thumbnail */}
        {project.image_url ? (
          <div
            onClick={() => onSelect(project)}
            className="w-full h-48 sm:h-52 bg-slate-100 dark:bg-slate-900 overflow-hidden relative cursor-pointer"
          >
            <img
              src={project.image_url}
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 dark:opacity-80 pointer-events-none" />
            <div className="absolute top-3 right-3">
              {getStatusBadge(project.status)}
            </div>
            {project.is_featured ? (
              <div className="absolute top-3 left-3">
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-semibold shadow-md backdrop-blur-md">
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
              </div>
            ) : null}
          </div>
        ) : (
          <div
            onClick={() => onSelect(project)}
            className="w-full h-36 bg-gradient-to-br from-indigo-50 via-slate-100 to-slate-200 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 border-b border-slate-200/60 dark:border-white/5 cursor-pointer relative"
          >
            <span className="text-xl font-bold gradient-text">{project.name}</span>
            <div className="absolute top-3 right-3">
              {getStatusBadge(project.status)}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-indigo-400">
              {project.category}
            </span>
            {project.start_date && (
              <span className="text-[11px] text-slate-400 font-mono">
                {project.start_date}
              </span>
            )}
          </div>

          <h3
            onClick={() => onSelect(project)}
            className="text-lg font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>{project.name}</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 shrink-0" />
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
            {project.short_desc}
          </p>

          {/* Tech stack badges */}
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {technologies.slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/5 text-slate-300 border border-white/5"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 4 && (
                <span className="px-1.5 py-0.5 rounded-md text-[11px] font-mono bg-white/5 text-slate-400">
                  +{technologies.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
        <button
          onClick={() => onSelect(project)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
        >
          View Case Study
        </button>

        <div className="flex items-center gap-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="GitHub Repository"
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 transition-colors"
              title="Live Application"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
