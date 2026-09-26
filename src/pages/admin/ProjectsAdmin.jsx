import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, ExternalLink, FolderGit2 } from 'lucide-react';
import { GithubIcon } from '../../components/common/SocialIcons';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FileUpload from '../../components/ui/FileUpload';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const initialProjectState = {
  name: '',
  slug: '',
  short_desc: '',
  full_desc: '',
  image_url: '',
  gallery: [],
  technologies: [],
  github_url: '',
  live_url: '',
  case_study_url: '',
  category: 'Full-Stack',
  status: 'Completed',
  is_featured: 0,
  start_date: '',
  end_date: '',
  display_order: 0,
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState(initialProjectState);
  const [techInput, setTechInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      ...initialProjectState,
      display_order: projects.length + 1,
    });
    setTechInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      ...project,
      technologies: project.technologies || [],
      gallery: project.gallery || [],
    });
    setTechInput('');
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleAddTech = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (!techInput.trim()) return;
      if (!formData.technologies.includes(techInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          technologies: [...prev.technologies, techInput.trim()],
        }));
      }
      setTechInput('');
    }
  };

  const handleRemoveTech = (index) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.short_desc.trim()) {
      toast.error('Project title and summary are required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingProject) {
        await api.updateProject(editingProject.id, formData);
        toast.success(`Project "${formData.name}" updated!`);
      } else {
        await api.createProject(formData);
        toast.success(`Project "${formData.name}" created!`);
      }
      setIsModalOpen(false);
      loadProjects();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteProject(projectToDelete.id);
      toast.success(`Project "${projectToDelete.name}" deleted.`);
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
      loadProjects();
    } catch (err) {
      toast.error(err.message || 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered listing
  const filteredProjects = projects.filter((p) => {
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(q) ||
      p.short_desc.toLowerCase().includes(q) ||
      (p.technologies && p.technologies.some((t) => t.toLowerCase().includes(q)));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Projects Management</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, update, reorder, and showcase your digital software projects.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Project
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['All', 'Full-Stack', 'SaaS', 'Frontend', 'Tools'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-900/60 border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>
      </div>

      {/* Projects Table / Cards */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="space-y-3">
          {filteredProjects.map((p) => (
            <Card key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                {p.image_url ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/10">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-indigo-400">
                    <FolderGit2 className="w-6 h-6" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100 truncate">{p.name}</h4>
                    {p.is_featured ? (
                      <Badge variant="indigo" size="sm">Featured</Badge>
                    ) : null}
                    <Badge variant={p.status === 'Completed' ? 'emerald' : 'amber'} size="sm">
                      {p.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">{p.short_desc}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono mt-1">
                    <span>{p.category}</span>
                    <span>•</span>
                    <span>Order: {p.display_order}</span>
                    {p.technologies?.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{p.technologies.slice(0, 3).join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {p.live_url && (
                  <a
                    href={p.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="Live Demo"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {p.github_url && (
                  <a
                    href={p.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="GitHub"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Edit Project"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setProjectToDelete(p);
                    setDeleteConfirmOpen(true);
                  }}
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderGit2}
          title="No projects found"
          description="Create your first project entry to showcase it dynamically."
          actionText="Add Project"
          onAction={handleOpenAdd}
        />
      )}

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? `Edit: ${editingProject.name}` : 'Create New Project'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Project Title *"
              name="name"
              placeholder="SpendWise"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
            <Input
              label="URL Slug (Optional, auto-generated)"
              name="slug"
              placeholder="spendwise"
              value={formData.slug}
              onChange={handleFormChange}
            />
          </div>

          <Textarea
            label="Short Description *"
            name="short_desc"
            rows={2}
            placeholder="High-level overview visible on cards..."
            value={formData.short_desc}
            onChange={handleFormChange}
            required
          />

          <Textarea
            label="Full Case Study & Architectural Details"
            name="full_desc"
            rows={4}
            placeholder="Detailed features, design patterns, state management..."
            value={formData.full_desc}
            onChange={handleFormChange}
          />

          <FileUpload
            label="Featured Cover Image"
            value={formData.image_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
          />

          {/* Tech Stack Pills Input */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-medium text-slate-300">
              Technologies & Tools (Press Enter or click Add)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. React, TypeScript, SQLite"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                className="flex-1 px-3.5 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddTech}>
                Add
              </Button>
            </div>
            {formData.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {formData.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(idx)}
                      className="hover:text-rose-400 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Live Demo URL"
              name="live_url"
              placeholder="https://spendwise.aaryanjagga.dev"
              value={formData.live_url}
              onChange={handleFormChange}
            />
            <Input
              label="GitHub Repository URL"
              name="github_url"
              placeholder="https://github.com/aaryanjagga/spendwise"
              value={formData.github_url}
              onChange={handleFormChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              options={['Full-Stack', 'SaaS', 'Frontend', 'Tools', 'AI', 'Other']}
            />
            <Select
              label="Project Status"
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              options={['Completed', 'In Progress', 'Concept', 'Archived']}
            />
            <Input
              label="Display Order (Priority)"
              name="display_order"
              type="number"
              value={formData.display_order}
              onChange={handleFormChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="start_date"
              placeholder="2024-01"
              value={formData.start_date}
              onChange={handleFormChange}
            />
            <Input
              label="End Date"
              name="end_date"
              placeholder="2024-03"
              value={formData.end_date}
              onChange={handleFormChange}
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={!!formData.is_featured}
                onChange={handleFormChange}
                className="w-4 h-4 rounded border-white/20 text-indigo-600 focus:ring-indigo-500/50 bg-slate-900"
              />
              <span className="text-xs sm:text-sm font-medium text-slate-200">
                Mark as Featured Project (prominently placed on homepage)
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
            >
              {editingProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={`Delete "${projectToDelete?.name}"?`}
        message="Are you sure you want to delete this project? This will permanently remove it from your portfolio."
        isLoading={isDeleting}
      />
    </div>
  );
}
