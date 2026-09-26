import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Award, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FileUpload from '../../components/ui/FileUpload';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const initialCertState = {
  name: '',
  issuer: '',
  issue_date: '',
  credential_id: '',
  credential_url: '',
  certificate_image: '',
  description: '',
  is_featured: 0,
  display_order: 0,
};

export default function CertificationsAdmin() {
  const [certs, setCerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [formData, setFormData] = useState(initialCertState);
  const [isSaving, setIsSaving] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const loadCerts = async () => {
    try {
      const data = await api.getCerts();
      setCerts(data);
    } catch (err) {
      toast.error('Failed to load certifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const handleOpenAdd = () => {
    setEditingCert(null);
    setFormData({
      ...initialCertState,
      display_order: certs.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingCert(cert);
    setFormData({ ...cert });
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
    if (!formData.name.trim() || !formData.issuer.trim()) {
      toast.error('Certificate name and issuer are required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingCert) {
        await api.updateCert(editingCert.id, formData);
        toast.success(`Certification "${formData.name}" updated!`);
      } else {
        await api.createCert(formData);
        toast.success(`Certification added!`);
      }
      setIsModalOpen(false);
      loadCerts();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!certToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteCert(certToDelete.id);
      toast.success(`Certification removed.`);
      setDeleteConfirmOpen(false);
      setCertToDelete(null);
      loadCerts();
    } catch (err) {
      toast.error(err.message || 'Failed to delete certification');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Certifications & Credentials</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your verified industry simulations, certificates, and credentials.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Certification
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : certs.length > 0 ? (
        <div className="space-y-3">
          {certs.map((c) => (
            <Card key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hoverEffect">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100 truncate">{c.name}</h4>
                    {c.is_featured ? <Badge variant="emerald" size="sm" dot>Featured</Badge> : null}
                  </div>
                  <p className="text-xs font-semibold text-indigo-400">{c.issuer}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {c.issue_date} {c.credential_id ? `• ID: ${c.credential_id}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {c.credential_url && (
                  <a
                    href={c.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="View Credential"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCertToDelete(c);
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
          icon={Award}
          title="No certifications added"
          description="Add your certifications or course completions."
          actionText="Add Certification"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCert ? `Edit: ${editingCert.name}` : 'Add Certification'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Certification Name *"
            name="name"
            placeholder="Technology Consulting Virtual Experience"
            value={formData.name}
            onChange={handleFormChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Issuing Organization *"
              name="issuer"
              placeholder="Deloitte / Goldman Sachs / Google"
              value={formData.issuer}
              onChange={handleFormChange}
              required
            />
            <Input
              label="Issue Date / Year"
              name="issue_date"
              placeholder="2024"
              value={formData.issue_date}
              onChange={handleFormChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Credential ID"
              name="credential_id"
              placeholder="DEL-VIRT-2024"
              value={formData.credential_id}
              onChange={handleFormChange}
            />
            <Input
              label="Verification URL"
              name="credential_url"
              placeholder="https://forage.com/verify/..."
              value={formData.credential_url}
              onChange={handleFormChange}
            />
          </div>

          <Textarea
            label="Description / Skills Gained"
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleFormChange}
          />

          <FileUpload
            label="Certificate Badge / Image (Optional)"
            value={formData.certificate_image}
            onChange={(url) => setFormData((prev) => ({ ...prev, certificate_image: url }))}
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
                <span className="text-xs text-slate-300 font-medium">Featured Credential</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingCert ? 'Save Changes' : 'Add Credential'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={`Delete "${certToDelete?.name}"?`}
        message="This will permanently delete this certification record."
        isLoading={isDeleting}
      />
    </div>
  );
}
