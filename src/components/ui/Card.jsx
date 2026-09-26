import { forwardRef } from 'react';

const Card = forwardRef(({
  children,
  className = '',
  hoverEffect = false,
  glass = true,
  glow = false,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`rounded-2xl transition-all duration-300 relative ${
        glass ? 'glass-panel' : 'bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800'
      } ${
        hoverEffect
          ? 'hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5'
          : ''
      } ${
        glow ? 'glow-accent' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
