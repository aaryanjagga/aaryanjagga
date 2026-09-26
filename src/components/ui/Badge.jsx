export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide transition-colors';

  const variants = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-white/10',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/25',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/25',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/25',
    cyan: 'bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/25',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/25',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  const dotColors = {
    default: 'bg-slate-500 dark:bg-slate-400',
    indigo: 'bg-indigo-600 dark:bg-indigo-400',
    emerald: 'bg-emerald-600 dark:bg-emerald-400',
    amber: 'bg-amber-600 dark:bg-amber-400',
    rose: 'bg-rose-600 dark:bg-rose-400',
    cyan: 'bg-cyan-600 dark:bg-cyan-400',
    purple: 'bg-purple-600 dark:bg-purple-400',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default} animate-pulse`} />
      )}
      {children}
    </span>
  );
}
