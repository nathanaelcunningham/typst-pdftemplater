import { type ComponentPropsWithoutRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-amber text-charcoal hover:bg-amber-dark shadow-md hover:shadow-lg',
    secondary:
        'bg-cream-dark hover:bg-slate/20',
    danger:
        'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 hover:border-danger',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
};

const baseStyles = 'font-medium rounded-md active:scale-95 transition-all';

export function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}: ButtonProps) {
    const variantClassName = variantStyles[variant];
    const sizeClassName = sizeStyles[size];

    return (
        <button
            className={`${baseStyles} ${variantClassName} ${sizeClassName} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
