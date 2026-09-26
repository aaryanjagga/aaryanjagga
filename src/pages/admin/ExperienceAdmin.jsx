import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';
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

const initialExpState = {
  company: '',
  role: '',
  employment_type: 'Internship',
  start_date: '',
  end_date: '',
  is_current: 0,
  description: '',
  responsibilities: [],
  technologies: [],
  company_logo: '',
  location: '',
  display_order: 0,
};

export default function ExperienceAdmin() {
  const [experience, setExperience] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [formData, setFormData] = useState(initialExpState);
  const [respInput, setRespInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expToDelete, setExpToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const loadExperience = async () => {
    try {
      const data = await api.getExperience();
      setExperience(data);
    } catch (err) {
      toast.error('Failed to load experience records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExperience();
  }, []);

  const handleOpenAdd = () => {
    setEditingExp(null);
    setFormData({
      ...initialExpState,
      display_order: experience.length + 1,
    });
    setRespInput('');
    setTechInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingExp(exp);
    setFormData({
      ...exp,
      responsibilities: exp.responsibilities || [],
      technologies: exp.technologies || [],
    });
    setRespInput('');
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

  const handleAddResp = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (!respInput.trim()) return;
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, respInput.trim()],
      }));
      setRespInput('');
    }
  };

  const handleRemoveResp = (idx) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== idx),
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

  const handleRemoveTech = (idx) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim()) {
      toast.error('Company and role are required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingExp) {
        await api.updateExperience(editingExp.id, formData);
        toast.success(`Experience at "${formData.company}" updated!`);
      } else {
        await api.createExperience(formData);
        toast.success(`Experience at "${formData.company}" added!`);
      }
      setIsModalOpen(false);
      loadExperience();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!expToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteExperience(expToDelete.id);
      toast.success(`Experience at "${expToDelete.company}" removed.`);
      setDeleteConfirmOpen(false);
      setExpToDelete(null);
      loadExperience();
    } catch (err) {
      toast.error(err.message || 'Failed to delete experience');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Experience & Career</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your employment history, internships, ambassadorships, and technical contributions.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Experience
        </Button>
      </div>

      {/* Experience List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : experience.length > 0 ? (
        <div className="space-y-4">
          {experience.map((exp) => (
            <Card key={exp.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hoverEffect">
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-indigo-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-sm sm:text-base font-bold text-slate-100">{exp.role}</h4>
                    <span className="text-xs font-semibold text-indigo-400">@ {exp.company}</span>
                    <Badge variant="indigo" size="sm">{exp.employment_type}</Badge>
                    {exp.is_current ? <Badge variant="emerald" size="sm" dot>Current</Badge> : null}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{exp.description}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    {exp.start_date} {exp.end_date ? `— ${exp.end_date}` : ''} • {exp.location || 'Remote'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleOpenEdit(exp)}
                  className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setExpToDelete(exp);
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
          icon={Briefcase}
          title="No experience records"
          description="Add your internship or professional experience details."
          actionText="Add Experience"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExp ? `Edit: ${editingExp.role} at ${editingExp.company}` : 'Add Experience Entry'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company / Organization *"
              name="company"
              placeholder="CodeAlpha"
              value={formData.company}
              onChange={handleFormChange}
              required
            />
            <Input
              label="Role / Title *"
              name="role"
              placeholder="Python Programming Intern"
              value={formData.role}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Employment Type"
              name="employment_type"
              value={formData.employment_type}
              onChange={handleFormChange}
              options={['Internship', 'Full-time', 'Part-time', 'Contract', 'Ambassadorship', 'Open Source']}
            />
            <Input
              label="Location"
              name="location"
              placeholder="Remote / Chandigarh, India"
              value={formData.location}
              onChange={handleFormChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Start Date"
              name="start_date"
              placeholder="2023-11"
              value={formData.start_date}
              onChange={handleFormChange}
            />
            <Input
              label="End Date"
              name="end_date"
              placeholder="2024-02"
              value={formData.end_date}
              onChange={handleFormChange}
              disabled={!!formData.is_current}
            />
            <Input
              label="Display Order"
              name="display_order"
              type="number"
              value={formData.display_order}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_current"
                checked={!!formData.is_current}
                onChange={handleFormChange}
                className="w-4 h-4 rounded border-white/20 text-indigo-600 focus:ring-indigo-500/50 bg-slate-900"
              />
              <span className="text-xs text-slate-300 font-medium">Currently in this role</span>
            </label>
          </div>

          <Textarea
            label="Overview Description"
            name="description"
            rows={2}
            placeholder="Key overview of scope and objectives..."
            value={formData.description}
            onChange={handleFormChange}
          />

          {/* Responsibilities list */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-medium text-slate-300">
              Key Responsibilities / Bullets
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Engineered responsive UI components using HTML5 & CSS3"
                value={respInput}
                onChange={(e) => setRespInput(e.target.value)}
                onKeyDown={handleAddResp}
                className="flex-1 px-3.5 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddResp}>
                Add
              </Button>
            </div>
            {formData.responsibilities?.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {formData.responsibilities.map((resp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                    <span>{resp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveResp(idx)}
                      className="text-rose-400 hover:text-rose-300 ml-2 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Technologies used */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-medium text-slate-300">
              Technologies Utilized
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Python, Git, OOP"
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
                {formData.technologies.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono bg-white/5 text-slate-300 border border-white/5"
                  >
                    <span>{t}</span>
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingExp ? 'Save Changes' : 'Add Experience'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={`Delete experience at "${expToDelete?.company}"?`}
        message="This will permanently delete this experience entry."
        isLoading={isDeleting}
      />
    </div>
  );
}
