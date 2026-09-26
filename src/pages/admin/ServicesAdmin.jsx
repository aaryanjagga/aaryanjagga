import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const initialServiceState = {
  title: '',
  description: '',
  icon: 'Layers',
  features: [],
  is_active: 1,
  display_order: 0,
};

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState(initialServiceState);
  const [featureInput, setFeatureInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (err) {
      toast.error('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      ...initialServiceState,
      display_order: services.length + 1,
    });
    setFeatureInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setFormData({
      ...service,
      features: service.features || [],
    });
    setFeatureInput('');
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleAddFeature = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (!featureInput.trim()) return;
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingService) {
        await api.updateService(editingService.id, formData);
        toast.success(`Service "${formData.title}" updated!`);
      } else {
        await api.createService(formData);
        toast.success(`Service "${formData.title}" created!`);
      }
      setIsModalOpen(false);
      loadServices();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteService(serviceToDelete.id);
      toast.success(`Service deleted.`);
      setDeleteConfirmOpen(false);
      setServiceToDelete(null);
      loadServices();
    } catch (err) {
      toast.error(err.message || 'Failed to delete service');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Services & Capabilities</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your service offerings, feature checklists, and capability cards.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Service
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s) => (
            <Card key={s.id} className="p-5 flex flex-col justify-between hoverEffect">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-base font-bold text-slate-100">{s.title}</h4>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setServiceToDelete(s);
                        setDeleteConfirmOpen(true);
                      }}
                      className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-4">{s.description}</p>

                {s.features?.length > 0 && (
                  <div className="space-y-1.5 pt-3 border-t border-white/5">
                    {s.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 mt-4 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Icon: {s.icon}</span>
                <span>Order: {s.display_order}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No services configured"
          description="Create service cards to show your technical capabilities."
          actionText="Add Service"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? `Edit: ${editingService.title}` : 'Add Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Service Title *"
            name="title"
            placeholder="Full-Stack Web Development"
            value={formData.title}
            onChange={handleFormChange}
            required
          />

          <Textarea
            label="Service Description *"
            name="description"
            rows={2}
            placeholder="End-to-end web engineering from interface to database..."
            value={formData.description}
            onChange={handleFormChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Icon Preset"
              name="icon"
              value={formData.icon}
              onChange={handleFormChange}
              options={['Layers', 'Sparkles', 'Palette', 'Server']}
            />
            <Input
              label="Display Order"
              name="display_order"
              type="number"
              value={formData.display_order}
              onChange={handleFormChange}
            />
          </div>

          {/* Features Checklist */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-medium text-slate-300">
              Capability Highlights / Features
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. React & TypeScript frontend architecture"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={handleAddFeature}
                className="flex-1 px-3.5 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddFeature}>
                Add
              </Button>
            </div>
            {formData.features?.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {formData.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-rose-400 hover:text-rose-300 ml-2 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={!!formData.is_active}
                onChange={handleFormChange}
                className="w-4 h-4 rounded border-white/20 text-indigo-600 focus:ring-indigo-500/50 bg-slate-900"
              />
              <span className="text-xs text-slate-300 font-medium">Service Active (Visible publicly)</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingService ? 'Save Changes' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={`Delete service?`}
        message="This will permanently delete this service capability."
        isLoading={isDeleting}
      />
    </div>
  );
}
