import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { ExternalLink, Calendar, Layers, CheckCircle2, Clock } from 'lucide-react';
import { GithubIcon } from '../common/SocialIcons';

export default function ProjectModal({ project, isOpen, onClose }) {
  if (!project) return null;

  const technologies = project.technologies || [];
  const gallery = project.gallery || [];

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.name}
      subtitle={project.category}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 text-left">
        {/* Project Hero Banner */}
        {project.image_url && (
          <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative">
            <img
              src={project.image_url}
              alt={project.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              {getStatusBadge(project.status)}
            </div>
          </div>
        )}

        {/* Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            {project.start_date && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {project.start_date} {project.end_date ? `— ${project.end_date}` : ''}
                </span>
              </div>
            )}
            <Badge variant="indigo" size="sm">
              <Layers className="w-3 h-3 mr-1" /> {project.category}
            </Badge>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Source</span>
              </a>
            )}
          </div>
        </div>

        {/* Short Summary */}
        <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
          {project.short_desc}
        </p>

        {/* Detailed Description */}
        {project.full_desc && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              About the Architecture & Features
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-white/[0.02] p-4 rounded-xl border border-white/5">
              {project.full_desc}
            </p>
          </div>
        )}

        {/* Tech Stack Pills */}
        {technologies.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Technologies & Frameworks
            </h4>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gallery / Extra Screenshots if present */}
        {gallery.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Screenshots
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((imgUrl, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-white/10 bg-slate-900/60 aspect-video">
                  <img src={imgUrl} alt={`${project.name} preview ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
