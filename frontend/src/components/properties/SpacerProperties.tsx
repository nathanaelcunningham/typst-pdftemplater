import { useTemplateStore } from "../../store/templateStore";
import type { SpacerComponentProps } from "../../types/components";
import type { ComponentInstance } from "../../types/template";
import { NumberInput, Select } from "../ui";

interface SpacerPropertiesProps {
    component: ComponentInstance;
}


export function SpacerProperties({ component }: SpacerPropertiesProps) {
    const updateComponent = useTemplateStore((state) => state.updateComponent);
    const props = component.props as SpacerComponentProps;

    const handleChange = (updates: Partial<SpacerComponentProps>) => {
        updateComponent(component.id, {
            props: { ...props, ...updates },
        });
    };

    return (
        <div className="space-y-4">
            {/* To Parameter */}
            <Select
                label="Direction"
                value={props.direction}
                onChange={(e) => handleChange({ direction: e.target.value as 'vertical' | 'horizontal' })}
                options={[
                    { value: 'vertical', label: 'Vertical' },
                    { value: 'horizontal', label: 'Horizontal' },
                ]}
            />
            <NumberInput
                label="Spacer Size"
                value={props.amount}
                onChange={(amount) => handleChange({ amount })}
                min={6}
                max={72}
            />
        </div>
    );
}
