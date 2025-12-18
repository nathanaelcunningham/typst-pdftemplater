import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

interface IconButtonProps extends ComponentPropsWithoutRef<'button'> {
  icon: ReactNode;
  label?: string;
}

export function IconButton({
  icon,
  label,
  className = '',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-slate/20 transition-colors group ${className}`}
      {...props}
    >
      {icon}
      {label && (
        <span className="text-xl font-serif font-semibold text-cream tracking-tight">
          {label}
        </span>
      )}
      {children}
    </button>
  );
}
