import { type ComponentPropsWithoutRef } from 'react';

interface TabProps extends ComponentPropsWithoutRef<'button'> {
  active?: boolean;
  mono?: boolean; // For code-related tabs
}

export function Tab({
  active = false,
  mono = false,
  className = '',
  children,
  ...props
}: TabProps) {
  const baseStyles = 'px-6 py-3.5 text-sm font-medium transition-all border-b-2';
  const fontStyles = mono ? 'font-mono' : '';
  const activeStyles = active
    ? 'text-amber-dark border-amber bg-cream/30'
    : 'text-slate-lighter border-transparent hover:text-ink hover:bg-cream/50';

  return (
    <button
      className={`${baseStyles} ${fontStyles} ${activeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
