import { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  error,
  helperText,
  rows = 4,
  className = '',
  id,
  ...props
}, ref) => {
  const textareaId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-900/60 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-y ${
          error ? 'border-rose-500/70 focus:border-rose-500' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:border-indigo-500'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
