import { useTemplateStore } from "../../store/templateStore";
import type { HeadingComponentProps, HeadingLevel } from "../../types/components";
import type { ComponentInstance } from "../../types/template";
import { Select, TextInput } from "../ui";
import { VariableSelector } from "./VariableSelector";

interface HeadingPropertiesProps {
    component: ComponentInstance
}

export function HeadingProperties({ component }: HeadingPropertiesProps) {
    const updateComponent = useTemplateStore((state) => state.updateComponent);
    const props = component.props as HeadingComponentProps

    const handleChange = (updates: Partial<HeadingComponentProps>) => {
        updateComponent(component.id, {
            props: { ...props, ...updates },
        });
    };

    const handleVariableInsert = (variablePath: string) => {
        handleChange({ content: variablePath });
    }

    return (
        <div className="space-y-4">
            <TextInput
                label="Content"
                value={props.content}
                onChange={(e) => handleChange({ content: e.target.value })}
                placeholder="Heading Content"
            />

            <Select
                label="Heading Level"
                value={props.level.toString()}
                onChange={(e) => handleChange({ level: parseInt(e.target.value) as HeadingLevel })}
                options={[
                    { value: '1', label: 'Heading 1' },
                    { value: '2', label: 'Heading 2' },
                    { value: '3', label: 'Heading 3' },
                    { value: '4', label: 'Heading 4' },
                    { value: '5', label: 'Heading 5' },
                    { value: '6', label: 'Heading 6' },
                ]}
            />

            <Select
                label="Alignment"
                value={props.alignment}
                onChange={(e) => handleChange({ alignment: e.target.value as 'left' | 'center' | 'right' })}
                options={[
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                    { value: 'right', label: 'Right' },
                ]}
            />
            <VariableSelector onSelect={handleVariableInsert} />
        </div>
    )
}
