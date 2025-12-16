interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ title, description, className = '' }: SectionHeaderProps) {
  return (
    <div className={`p-6 border-b-2 border-cream-dark bg-gradient-to-b from-cream/50 to-transparent ${className}`}>
      <h2 className="text-lg font-serif font-semibold text-charcoal tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-xs text-slate-lighter mt-1">{description}</p>
      )}
    </div>
  );
}
