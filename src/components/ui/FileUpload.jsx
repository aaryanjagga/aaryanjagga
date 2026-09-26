import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { api } from '../../services/api';

export default function FileUpload({
  label = 'Image / Media',
  value,
  onChange,
  helperText = 'Upload an image (PNG, JPG, WebP up to 5MB) or enter an external URL',
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(!value?.startsWith('/uploads'));
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      const res = await api.uploadImage(file);
      onChange(res.url);
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  return (
    <div className="w-full space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-300">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
        >
          {showUrlInput ? <Upload className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
          {showUrlInput ? 'Upload file instead' : 'Enter URL instead'}
        </button>
      </div>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-slate-900/60 p-2 flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-black/40 overflow-hidden flex items-center justify-center shrink-0 border border-white/5">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-mono text-slate-300 truncate">{value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Asset attached</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
            title="Remove asset"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : showUrlInput ? (
        <div className="space-y-1">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/15 hover:border-indigo-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/[0.01] hover:bg-white/[0.03]"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-xs text-slate-300 font-medium">Uploading file...</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                </div>
                <p className="text-[11px] text-slate-500">PNG, JPG, WebP up to 5MB</p>
              </>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-400">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-400">{helperText}</p>}
    </div>
  );
}
