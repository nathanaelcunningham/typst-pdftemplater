interface EmptyStateProps {
  icon: string;
  message: string;
  helperText?: string;
  className?: string;
}

export function EmptyState({ icon, message, helperText, className = '' }: EmptyStateProps) {
  return (
    <div className={`text-center py-16 px-4 ${className}`}>
      <div className="text-4xl mb-3 opacity-30">{icon}</div>
      <p className="text-sm text-slate-lighter font-medium">{message}</p>
      {helperText && (
        <p className="text-xs text-slate-lighter/60 mt-2">{helperText}</p>
      )}
    </div>
  );
}
