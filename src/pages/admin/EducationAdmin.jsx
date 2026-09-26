import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GraduationCap } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const initialEduState = {
  institution: '',
  degree: '',
  field_of_study: '',
  start_date: '',
  end_date: '',
  is_current: 0,
  description: '',
  grade_cgpa: '',
  location: '',
  logo_url: '',
  coursework: '',
  display_order: 0,
};

export default function EducationAdmin() {
  const [education, setEducation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [formData, setFormData] = useState(initialEduState);
  const [isSaving, setIsSaving] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eduToDelete, setEduToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const loadEducation = async () => {
    try {
      const data = await api.getEducation();
      setEducation(data);
    } catch (err) {
      toast.error('Failed to load education entries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEducation();
  }, []);

  const handleOpenAdd = () => {
    setEditingEdu(null);
    setFormData({
      ...initialEduState,
      display_order: education.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingEdu(item);
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
    if (!formData.institution.trim() || !formData.degree.trim()) {
      toast.error('Institution and Degree are required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingEdu) {
        await api.updateEducation(editingEdu.id, formData);
        toast.success(`Education at "${formData.institution}" updated!`);
      } else {
        await api.createEducation(formData);
        toast.success(`Education entry added!`);
      }
      setIsModalOpen(false);
      loadEducation();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!eduToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteEducation(eduToDelete.id);
      toast.success(`Education record deleted.`);
      setDeleteConfirmOpen(false);
      setEduToDelete(null);
      loadEducation();
    } catch (err) {
      toast.error(err.message || 'Failed to delete record');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Education & Academics</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your university degrees, colleges, coursework, and credentials.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Education
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : education.length > 0 ? (
        <div className="space-y-4">
          {education.map((item) => (
            <Card key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hoverEffect">
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-indigo-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-slate-100">{item.degree}</h4>
                    <span className="text-xs font-semibold text-indigo-400">@ {item.institution}</span>
                    {item.is_current ? <Badge variant="emerald" size="sm" dot>Current</Badge> : null}
                    {item.grade_cgpa && <Badge variant="indigo" size="sm">{item.grade_cgpa}</Badge>}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    {item.start_date} — {item.end_date || (item.is_current ? 'Present' : '')} • {item.location || 'India'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setEduToDelete(item);
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
          icon={GraduationCap}
          title="No education entries"
          description="Add your degree or collegiate records."
          actionText="Add Education"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEdu ? `Edit: ${editingEdu.institution}` : 'Add Education Record'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Institution / University *"
              name="institution"
              placeholder="Panjab University"
              value={formData.institution}
              onChange={handleFormChange}
              required
            />
            <Input
              label="Degree / Qualification *"
              name="degree"
              placeholder="BCA — Bachelor of Computer Applications"
              value={formData.degree}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Field of Study"
              name="field_of_study"
              placeholder="Computer Science"
              value={formData.field_of_study}
              onChange={handleFormChange}
            />
            <Input
              label="Grade / CGPA"
              name="grade_cgpa"
              placeholder="Current Student / 8.5 CGPA"
              value={formData.grade_cgpa}
              onChange={handleFormChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Start Date"
              name="start_date"
              placeholder="2023"
              value={formData.start_date}
              onChange={handleFormChange}
            />
            <Input
              label="End Date"
              name="end_date"
              placeholder="2026"
              value={formData.end_date}
              onChange={handleFormChange}
              disabled={!!formData.is_current}
            />
            <Input
              label="Location"
              name="location"
              placeholder="Chandigarh, India"
              value={formData.location}
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
              <span className="text-xs text-slate-300 font-medium">Currently enrolled student</span>
            </label>
          </div>

          <Textarea
            label="Overview Description"
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleFormChange}
          />

          <Textarea
            label="Relevant Coursework (comma separated)"
            name="coursework"
            rows={2}
            placeholder="Data Structures, DBMS, Operating Systems, Web Technologies"
            value={formData.coursework}
            onChange={handleFormChange}
          />

          <Input
            label="Display Order"
            name="display_order"
            type="number"
            value={formData.display_order}
            onChange={handleFormChange}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingEdu ? 'Save Changes' : 'Add Record'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={`Delete education entry?`}
        message="This will permanently delete this education record."
        isLoading={isDeleting}
      />
    </div>
  );
}
