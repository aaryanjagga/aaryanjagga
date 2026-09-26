import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Cpu } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const initialSkillState = {
  name: '',
  category: 'Frontend',
  icon: 'Code',
  proficiency: 80,
  experience_years: '',
  description: '',
  is_featured: 0,
  display_order: 0,
};

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState(initialSkillState);
  const [isSaving, setIsSaving] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const loadSkills = async () => {
    try {
      const data = await api.getSkills();
      setSkills(data);
    } catch (err) {
      toast.error('Failed to load skills');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setFormData({
      ...initialSkillState,
      display_order: skills.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({ ...skill });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category) {
      toast.error('Skill name and category are required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingSkill) {
        await api.updateSkill(editingSkill.id, formData);
        toast.success(`Skill "${formData.name}" updated!`);
      } else {
        await api.createSkill(formData);
        toast.success(`Skill "${formData.name}" added!`);
      }
      setIsModalOpen(false);
      loadSkills();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteSkill(skillToDelete.id);
      toast.success(`Skill "${skillToDelete.name}" deleted.`);
      setDeleteConfirmOpen(false);
      setSkillToDelete(null);
      loadSkills();
    } catch (err) {
      toast.error(err.message || 'Failed to delete skill');
    } finally {
      setIsDeleting(false);
    }
  };

  const categories = ['All', 'Frontend', 'Backend', 'Databases', 'Languages', 'Tools', 'AI', 'DevOps', 'Other'];

  const filteredSkills = skills.filter((s) => {
    const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Skills & Technologies</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your technology proficiencies, categories, icons, and experience.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Skill
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-900/60 border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>
      </div>

      {/* Skills Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((s) => (
            <Card key={s.id} className="p-4 flex flex-col justify-between hoverEffect group">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {s.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">{s.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSkillToDelete(s);
                        setDeleteConfirmOpen(true);
                      }}
                      className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {s.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {s.description}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">{s.experience_years || 'Skill'}</span>
                <span className="font-mono text-indigo-400 font-semibold">{s.proficiency}%</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Cpu}
          title="No skills found"
          description="Add technical skills and tools to populate your skills showcase."
          actionText="Add Skill"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? `Edit Skill: ${editingSkill.name}` : 'Add New Skill'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Skill Name *"
              name="name"
              placeholder="React"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
            <Select
              label="Category *"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              options={['Frontend', 'Backend', 'Databases', 'Languages', 'Tools', 'AI', 'DevOps', 'Other']}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Icon Preset"
              name="icon"
              value={formData.icon}
              onChange={handleFormChange}
              options={['Code', 'FileCode2', 'Terminal', 'Palette', 'Layout', 'Server', 'Cpu', 'Network', 'Database', 'HardDrive', 'Binary', 'GitBranch', 'Sparkles']}
            />
            <Input
              label="Experience Duration"
              name="experience_years"
              placeholder="e.g. 2+ yrs"
              value={formData.experience_years}
              onChange={handleFormChange}
            />
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <label>Proficiency Level</label>
              <span className="font-mono text-indigo-400">{formData.proficiency}%</span>
            </div>
            <input
              type="range"
              name="proficiency"
              min="10"
              max="100"
              step="5"
              value={formData.proficiency}
              onChange={handleFormChange}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <Input
            label="Brief Description / Focus"
            name="description"
            placeholder="Hooks, state management, component architecture"
            value={formData.description}
            onChange={handleFormChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Display Order"
              name="display_order"
              type="number"
              value={formData.display_order}
              onChange={handleFormChange}
            />
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={!!formData.is_featured}
                  onChange={handleFormChange}
                  className="w-4 h-4 rounded border-white/20 text-indigo-600 focus:ring-indigo-500/50 bg-slate-900"
                />
                <span className="text-xs text-slate-300 font-medium">Featured Skill</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingSkill ? 'Save Changes' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={`Delete "${skillToDelete?.name}"?`}
        message="Are you sure you want to remove this skill from your portfolio?"
        isLoading={isDeleting}
      />
    </div>
  );
}
