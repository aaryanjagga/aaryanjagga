import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Trophy, ExternalLink } from 'lucide-react';
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
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const initialAchievementState = {
  title: '',
  description: '',
  date: '',
  organization: '',
  icon: 'Rocket',
  link: '',
  is_featured: 0,
  display_order: 0,
};

export default function AchievementsAdmin() {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialAchievementState);
  const [isSaving, setIsSaving] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const loadAchievements = async () => {
    try {
      const data = await api.getAchievements();
      setAchievements(data);
    } catch (err) {
      toast.error('Failed to load achievements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      ...initialAchievementState,
      display_order: achievements.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
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
    if (!formData.title.trim()) {
      toast.error('Achievement title is required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await api.updateAchievement(editingItem.id, formData);
        toast.success(`Achievement "${formData.title}" updated!`);
      } else {
        await api.createAchievement(formData);
        toast.success(`Achievement added!`);
      }
      setIsModalOpen(false);
      loadAchievements();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteAchievement(itemToDelete.id);
      toast.success(`Achievement deleted.`);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      loadAchievements();
    } catch (err) {
      toast.error(err.message || 'Failed to delete achievement');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Achievements & Milestones</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Showcase personal engineering milestones, shipped products, and community brand accomplishments.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Achievement
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : achievements.length > 0 ? (
        <div className="space-y-3">
          {achievements.map((item) => (
            <Card key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hoverEffect">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100 truncate">{item.title}</h4>
                    {item.is_featured ? <Badge variant="emerald" size="sm" dot>Featured</Badge> : null}
                  </div>
                  <p className="text-xs text-indigo-400 font-medium">{item.organization}</p>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setItemToDelete(item);
                    setDeleteConfirmOpen(true);
                  }}
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Trophy}
          title="No achievements yet"
          description="Add your key milestones and accomplishments."
          actionText="Add Achievement"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit: ${editingItem.title}` : 'Add Achievement'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Achievement Title *"
            name="title"
            placeholder="Built & Shipped 10+ Modern Web Applications"
            value={formData.title}
            onChange={handleFormChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Organization / Affiliation"
              name="organization"
              placeholder="Code With Aaryan / Independent Builder"
              value={formData.organization}
              onChange={handleFormChange}
            />
            <Input
              label="Date / Period"
              name="date"
              placeholder="2023 - Present"
              value={formData.date}
              onChange={handleFormChange}
            />
          </div>

          <Textarea
            label="Description"
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleFormChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Icon Preset"
              name="icon"
              value={formData.icon}
              onChange={handleFormChange}
              options={['Rocket', 'Award', 'CheckCircle2', 'Star', 'Trophy']}
            />
            <Input
              label="Link URL (Optional)"
              name="link"
              placeholder="https://github.com/aaryanjagga"
              value={formData.link}
              onChange={handleFormChange}
            />
          </div>

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
                <span className="text-xs text-slate-300 font-medium">Featured Achievement</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingItem ? 'Save Changes' : 'Add Achievement'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={`Delete achievement?`}
        message="This will permanently delete this achievement."
        isLoading={isDeleting}
      />
    </div>
  );
}
