import type { ComponentInstance } from '../../types/template';
import type { StackContainerProps } from '../../types/components';
import { useTemplateStore } from '../../store/templateStore';
import { Button, NumberInput, Select } from '../ui';

interface StackContainerPropertiesProps {
    component: ComponentInstance;
}

export function StackContainerProperties({ component }: StackContainerPropertiesProps) {
    const updateContainerProps = useTemplateStore((state) => state.updateContainerProps);
    const unwrapContainer = useTemplateStore((state) => state.unwrapContainer);
    const props = component.props as StackContainerProps;

    const handleChange = (updates: Partial<StackContainerProps>) => {
        updateContainerProps(component.id, updates);
    };

    const handleUnwrap = () => {
        unwrapContainer(component.id);
    };

    return (
        <div className="space-y-4">
            {/* Header with unwrap button */}
            <div className="flex items-center justify-between p-3 bg-amber/10 border-2 border-amber/30 rounded-lg">
                <h3 className="text-sm font-serif font-semibold text-charcoal">Stack Container</h3>
                <Button onClick={handleUnwrap} variant="danger" size="sm">
                    Unwrap
                </Button>
            </div>

            {/* Direction */}
            <Select
                label="Direction"
                value={props.direction}
                onChange={(e) => handleChange({ direction: e.target.value as 'vertical' | 'horizontal' })}
                options={[
                    { value: 'vertical', label: 'Vertical (Top to Bottom)' },
                    { value: 'horizontal', label: 'Horizontal (Left to Right)' },
                ]}
            />

            {/* Spacing */}
            <NumberInput
                label="Spacing (pt)"
                value={props.spacing}
                onChange={(spacing) => handleChange({ spacing })}
                min={0}
            />

            {/* Alignment */}
            <Select
                label="Alignment"
                value={props.alignment || 'left'}
                onChange={(e) => handleChange({ alignment: e.target.value as 'left' | 'center' | 'right' })}
                options={[
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                    { value: 'right', label: 'Right' },
                ]}
            />

            <p className="text-xs text-slate-lighter">
                This container stacks its children {props.direction === 'vertical' ? 'vertically' : 'horizontally'} with the specified spacing.
            </p>
        </div>
    );
}
