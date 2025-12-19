import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

// Base input className used throughout the app
const baseInputClassName =
  'w-full px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all';

const baseLabelClassName =
  'block text-xs font-medium text-slate-light uppercase tracking-wider mb-2';

const baseHelperClassName = 'text-xs text-slate-lighter mt-1.5';

interface BaseFormFieldProps {
  label: ReactNode;
  helperText?: string;
  className?: string;
}

// Text Input
interface TextInputProps extends BaseFormFieldProps, Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  type?: 'text' | 'number' | 'email' | 'url';
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, helperText, className, ...inputProps }, ref) => {
    return (
      <div className={className}>
        <label className={baseLabelClassName}>{label}</label>
        <input ref={ref} className={baseInputClassName} {...inputProps} />
        {helperText && <p className={baseHelperClassName}>{helperText}</p>}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

// Textarea
interface TextareaProps extends BaseFormFieldProps, ComponentPropsWithoutRef<'textarea'> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, className, ...textareaProps }, ref) => {
    return (
      <div className={className}>
        <label className={baseLabelClassName}>{label}</label>
        <textarea ref={ref} className={baseInputClassName} {...textareaProps} />
        {helperText && <p className={baseHelperClassName}>{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select
interface SelectProps extends BaseFormFieldProps, ComponentPropsWithoutRef<'select'> {
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, className, options, ...selectProps }, ref) => {
    return (
      <div className={className}>
        <label className={baseLabelClassName}>{label}</label>
        <select ref={ref} className={baseInputClassName} {...selectProps}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && <p className={baseHelperClassName}>{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Color Picker (with text input)
interface ColorInputProps extends BaseFormFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ColorInput({ label, helperText, className, value, onChange }: ColorInputProps) {
  return (
    <div className={className}>
      <label className={baseLabelClassName}>{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-16 border-2 border-cream-dark rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink font-mono focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
          placeholder="#000000"
        />
      </div>
      {helperText && <p className={baseHelperClassName}>{helperText}</p>}
    </div>
  );
}

// Number Input (convenience wrapper)
interface NumberInputProps extends BaseFormFieldProps, Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ label, helperText, className, value, onChange, ...inputProps }, ref) => {
    return (
      <div className={className}>
        <label className={baseLabelClassName}>{label}</label>
        <input
          ref={ref}
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={baseInputClassName}
          {...inputProps}
        />
        {helperText && <p className={baseHelperClassName}>{helperText}</p>}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

// Checkbox
interface CheckboxProps extends BaseFormFieldProps, Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, className, checked, onCheckedChange, ...inputProps }, ref) => {
    return (
      <div className={className}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="w-5 h-5 border-2 border-cream-dark rounded text-amber focus:ring-2 focus:ring-amber/20 focus:ring-offset-0 cursor-pointer transition-all"
            {...inputProps}
          />
          <span className="text-sm font-medium text-ink">{label}</span>
        </label>
        {helperText && <p className={baseHelperClassName}>{helperText}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
