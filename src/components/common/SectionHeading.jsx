import Badge from '../ui/Badge';

export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignClasses = {
    center: 'text-center mx-auto items-center',
    left: 'text-left items-start',
    right: 'text-right items-end',
  };

  return (
    <div className={`flex flex-col mb-12 sm:mb-16 max-w-2xl ${alignClasses[align] || alignClasses.center} ${className}`}>
      {badge && (
        <div className="mb-3">
          <Badge variant="indigo" size="md">
            {badge}
          </Badge>
        </div>
      )}
      {title && (
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100 gradient-text">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
