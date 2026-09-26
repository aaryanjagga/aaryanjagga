import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/ui/FileUpload';
import Skeleton from '../../components/ui/Skeleton';

export default function ProfileAdmin() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const loadProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch {
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleHighlightChange = (index, value) => {
    const next = [...(profile.highlights || [])];
    next[index] = value;
    setProfile((prev) => ({ ...prev, highlights: next }));
  };

  const addHighlight = () => {
    setProfile((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), ''],
    }));
  };

  const removeHighlight = (index) => {
    setProfile((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateProfile(profile);
      toast.success('Profile and hero configuration saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Profile & Hero Management</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure your digital identity, hero headline, biography, and communication channels.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </Button>
      </div>

      {/* Hero Configuration */}
      <Card className="p-6 space-y-5">
        <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider pb-3 border-b border-white/5">
          Hero Presentation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            name="full_name"
            value={profile?.full_name || ''}
            onChange={handleChange}
            required
          />
          <Input
            label="Professional Title *"
            name="professional_title"
            value={profile?.professional_title || ''}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Short Tagline"
          name="short_tagline"
          value={profile?.short_tagline || ''}
          onChange={handleChange}
        />

        <Input
          label="Hero Main Heading *"
          name="hero_heading"
          value={profile?.hero_heading || ''}
          onChange={handleChange}
          required
        />

        <Textarea
          label="Hero Description"
          name="hero_description"
          rows={3}
          value={profile?.hero_description || ''}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Input
            label="Primary CTA Text"
            name="cta_primary_text"
            value={profile?.cta_primary_text || ''}
            onChange={handleChange}
          />
          <Input
            label="Primary CTA Target URL (e.g. #projects)"
            name="cta_primary_url"
            value={profile?.cta_primary_url || ''}
            onChange={handleChange}
          />
          <Input
            label="Secondary CTA Text"
            name="cta_secondary_text"
            value={profile?.cta_secondary_text || ''}
            onChange={handleChange}
          />
          <Input
            label="Secondary CTA Target URL (e.g. #contact)"
            name="cta_secondary_url"
            value={profile?.cta_secondary_url || ''}
            onChange={handleChange}
          />
        </div>

        {/* Available for work toggle */}
        <div className="pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_available_for_work"
              checked={!!profile?.is_available_for_work}
              onChange={handleChange}
              className="w-4 h-4 rounded border-white/20 text-indigo-600 focus:ring-indigo-500/50 bg-slate-900"
            />
            <span className="text-xs sm:text-sm font-medium text-slate-200">
              Display &quot;Available for work&quot; status pill on website
            </span>
          </label>
        </div>
      </Card>

      {/* Biography & Story */}
      <Card className="p-6 space-y-5">
        <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider pb-3 border-b border-white/5">
          About & Biography
        </h3>

        <Textarea
          label="Short Bio (Primary introductory statement)"
          name="bio_short"
          rows={3}
          value={profile?.bio_short || ''}
          onChange={handleChange}
        />

        <Textarea
          label="Long Bio (Detailed background & philosophy)"
          name="bio_long"
          rows={5}
          value={profile?.bio_long || ''}
          onChange={handleChange}
        />

        {/* Highlights List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300">Key Highlights / Bullets</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addHighlight}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Highlight
            </Button>
          </div>

          <div className="space-y-2">
            {(profile?.highlights || []).map((highlight, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => handleHighlightChange(idx, e.target.value)}
                  placeholder="e.g. Built 10+ open-source full-stack apps"
                  className="flex-1 px-3.5 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
                <button
                  type="button"
                  onClick={() => removeHighlight(idx)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Remove highlight"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Contact & Professional Channels */}
      <Card className="p-6 space-y-5">
        <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider pb-3 border-b border-white/5">
          Channels & URLs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={profile?.email || ''}
            onChange={handleChange}
          />
          <Input
            label="Phone (Optional)"
            name="phone"
            value={profile?.phone || ''}
            onChange={handleChange}
          />
          <Input
            label="Location"
            name="location"
            value={profile?.location || ''}
            onChange={handleChange}
          />
          <Input
            label="Personal Website URL"
            name="website_url"
            value={profile?.website_url || ''}
            onChange={handleChange}
          />
          <Input
            label="GitHub Profile URL"
            name="github_url"
            value={profile?.github_url || ''}
            onChange={handleChange}
          />
          <Input
            label="LinkedIn Profile URL"
            name="linkedin_url"
            value={profile?.linkedin_url || ''}
            onChange={handleChange}
          />
        </div>

        <FileUpload
          label="Resume Document / URL"
          value={profile?.resume_url || ''}
          onChange={(url) => setProfile((prev) => ({ ...prev, resume_url: url }))}
          helperText="Upload a PDF resume or enter an external document URL"
        />
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </Button>
      </div>
    </form>
  );
}
