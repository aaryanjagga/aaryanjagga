export default function Skeleton({ className = '', variant = 'rect' }) {
  const variants = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    text: 'rounded-md h-4',
  };

  return (
    <div
      className={`animate-pulse bg-white/5 border border-white/5 ${variants[variant] || variants.rect} ${className}`}
    />
  );
}
