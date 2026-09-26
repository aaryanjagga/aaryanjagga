import { useState, useEffect } from 'react';
import { Save, Lock, ShieldCheck, Globe } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';

export default function SettingsAdmin() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const toast = useToast();

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch {
      toast.error('Failed to load site settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await api.updateSettings(settings);
      toast.success('Site configuration saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update site settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please fill in current and new password');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await api.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Admin password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left pb-16">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">System & Site Settings</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure site metadata, SEO tags, messaging availability, and administrator credentials.
        </p>
      </div>

      {/* Site Configuration Form */}
      <form onSubmit={handleSaveSettings}>
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">Metadata & SEO</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Site Document Title *"
              name="site_title"
              value={settings?.site_title || ''}
              onChange={handleSettingsChange}
              required
            />
            <Input
              label="Primary Accent Hex"
              name="primary_accent"
              value={settings?.primary_accent || '#6366f1'}
              onChange={handleSettingsChange}
            />
          </div>

          <Textarea
            label="Meta Description (Search Engines & Open Graph)"
            name="site_description"
            rows={3}
            value={settings?.site_description || ''}
            onChange={handleSettingsChange}
          />

          <Input
            label="Meta Keywords (Comma separated)"
            name="meta_keywords"
            value={settings?.meta_keywords || ''}
            onChange={handleSettingsChange}
          />

          <Input
            label="Footer Copyright Text"
            name="footer_text"
            value={settings?.footer_text || ''}
            onChange={handleSettingsChange}
          />

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="allow_messages"
                checked={!!settings?.allow_messages}
                onChange={handleSettingsChange}
                className="w-4 h-4 rounded border-white/20 text-indigo-600 focus:ring-indigo-500/50 bg-slate-900"
              />
              <span className="text-xs sm:text-sm font-medium text-slate-200">
                Allow visitors to send messages via public contact form
              </span>
            </label>
          </div>

          <div className="pt-3 border-t border-white/5 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSavingSettings}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Site Settings
            </Button>
          </div>
        </Card>
      </form>

      {/* Password Management */}
      <form onSubmit={handlePasswordSubmit}>
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">Security & Credentials</h3>
          </div>

          <p className="text-xs text-slate-400">
            Update your private CMS authentication password. New password must be at least 8 characters.
          </p>

          <div className="space-y-4 max-w-md">
            <Input
              label="Current Password *"
              type="password"
              placeholder="••••••••••••"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />

            <Input
              label="New Password *"
              type="password"
              placeholder="••••••••••••"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
            />

            <Input
              label="Confirm New Password *"
              type="password"
              placeholder="••••••••••••"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
            />

            <Button
              type="submit"
              variant="secondary"
              isLoading={isUpdatingPassword}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Update Password
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
