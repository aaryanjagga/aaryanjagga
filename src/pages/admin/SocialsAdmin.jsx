import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Share2, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const initialSocialState = {
  platform: 'GitHub',
  url: '',
  icon: 'Github',
  is_visible: 1,
  display_order: 0,
};

export default function SocialsAdmin() {
  const [socials, setSocials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState(null);
  const [formData, setFormData] = useState(initialSocialState);
  const [isSaving, setIsSaving] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [socialToDelete, setSocialToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const loadSocials = async () => {
    try {
      const data = await api.getSocials();
      setSocials(data);
    } catch (err) {
      toast.error('Failed to load social links');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSocials();
  }, []);

  const handleOpenAdd = () => {
    setEditingSocial(null);
    setFormData({
      ...initialSocialState,
      display_order: socials.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (social) => {
    setEditingSocial(social);
    setFormData({ ...social });
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
    if (!formData.platform.trim() || !formData.url.trim()) {
      toast.error('Platform and URL are required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingSocial) {
        await api.updateSocial(editingSocial.id, formData);
        toast.success(`Social link for "${formData.platform}" updated!`);
      } else {
        await api.createSocial(formData);
        toast.success(`Social link created!`);
      }
      setIsModalOpen(false);
      loadSocials();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!socialToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteSocial(socialToDelete.id);
      toast.success(`Social link deleted.`);
      setDeleteConfirmOpen(false);
      setSocialToDelete(null);
      loadSocials();
    } catch (err) {
      toast.error(err.message || 'Failed to delete social link');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Social & Network Links</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure social media profiles and online presence links shown in the footer and headers.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Social Link
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : socials.length > 0 ? (
        <div className="space-y-3">
          {socials.map((s) => (
            <Card key={s.id} className="p-4 flex items-center justify-between gap-4 hoverEffect">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-indigo-400">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100">{s.platform}</h4>
                    {s.is_visible ? (
                      <Badge variant="emerald" size="sm">Visible</Badge>
                    ) : (
                      <Badge variant="default" size="sm">Hidden</Badge>
                    )}
                  </div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:underline truncate block max-w-sm mt-0.5"
                  >
                    {s.url}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSocialToDelete(s);
                    setDeleteConfirmOpen(true);
                  }}
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Share2}
          title="No social links configured"
          description="Add social channels like GitHub, LinkedIn, or Twitter."
          actionText="Add Social Link"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSocial ? `Edit: ${editingSocial.platform}` : 'Add Social Link'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Platform *"
              name="platform"
              value={formData.platform}
              onChange={handleFormChange}
              options={['GitHub', 'LinkedIn', 'X / Twitter', 'YouTube', 'Website', 'Instagram', 'Discord', 'Other']}
            />
            <Select
              label="Icon Preset"
              name="icon"
              value={formData.icon}
              onChange={handleFormChange}
              options={['Github', 'Linkedin', 'Twitter', 'Youtube', 'Globe', 'Link']}
            />
          </div>

          <Input
            label="URL *"
            name="url"
            placeholder="https://github.com/aaryanjagga"
            value={formData.url}
            onChange={handleFormChange}
            required
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
                  name="is_visible"
                  checked={!!formData.is_visible}
                  onChange={handleFormChange}
                  className="w-4 h-4 rounded border-white/20 text-indigo-600 focus:ring-indigo-500/50 bg-slate-900"
                />
                <span className="text-xs text-slate-300 font-medium">Visible on website</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingSocial ? 'Save Changes' : 'Add Link'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={`Delete social link?`}
        message="This will remove the link from public display."
        isLoading={isDeleting}
      />
    </div>
  );
}
