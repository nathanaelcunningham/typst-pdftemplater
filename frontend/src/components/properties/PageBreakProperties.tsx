import type { ComponentInstance } from '../../types/template';
import type { PageBreakComponentProps } from '../../types/components';
import { useTemplateStore } from '../../store/templateStore';
import { Select } from '../ui';

interface PageBreakPropertiesProps {
    component: ComponentInstance;
}

export function PageBreakProperties({ component }: PageBreakPropertiesProps) {
    const updateComponent = useTemplateStore((state) => state.updateComponent);
    const props = component.props as PageBreakComponentProps;

    const handleChange = (updates: Partial<PageBreakComponentProps>) => {
        updateComponent(component.id, {
            props: { ...props, ...updates },
        });
    };

    return (
        <div className="space-y-4">
            {/* To Parameter */}
            <Select
                label="Page Type"
                value={props.to}
                onChange={(e) => handleChange({ to: e.target.value as 'none' | 'odd' | 'even' })}
                options={[
                    { value: 'none', label: 'Any Page' },
                    { value: 'odd', label: 'Odd Page' },
                    { value: 'even', label: 'Even Page' },
                ]}
                helperText="Force the next content to start on a specific page type"
            />

            {/* Weak Parameter */}
            <div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={props.weak}
                        onChange={(e) => handleChange({ weak: e.target.checked })}
                        className="w-4 h-4 border-2 border-cream-dark rounded text-amber focus:ring-amber focus:ring-offset-0"
                    />
                    <span className="text-sm font-medium text-ink">
                        Weak page break
                    </span>
                </label>
                <p className="text-xs text-slate-light mt-1 ml-6">
                    Skip the page break if already at a page boundary
                </p>
            </div>
        </div>
    );
}
