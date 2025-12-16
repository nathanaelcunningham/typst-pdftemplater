import type { ComponentInstance } from '../../types/template';
import type { TextComponentProps } from '../../types/components';
import { useTemplateStore } from '../../store/templateStore';
import { VariableSelector } from './VariableSelector';
import { Textarea, NumberInput, Select, ColorInput } from '../ui';
import { useRef } from 'react';

interface TextPropertiesProps {
    component: ComponentInstance;
}

export function TextProperties({ component }: TextPropertiesProps) {
    const updateComponent = useTemplateStore((state) => state.updateComponent);
    const props = component.props as TextComponentProps;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (updates: Partial<TextComponentProps>) => {
        updateComponent(component.id, {
            props: { ...props, ...updates },
        });
    };

    const handleVariableInsert = (variablePath: string) => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent = props.content.substring(0, start) + variablePath + props.content.substring(end);
            handleChange({ content: newContent });

            // Set cursor position after the inserted variable
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + variablePath.length;
                textarea.focus();
            }, 0);
        } else {
            // If no textarea ref, just append to the end
            handleChange({ content: props.content + variablePath });
        }
    };

    return (
        <div className="space-y-4">
            {/* Content */}
            <Textarea
                ref={textareaRef}
                label="Content"
                value={props.content}
                onChange={(e) => handleChange({ content: e.target.value })}
                rows={4}
                placeholder="Enter text content..."
                helperText={`Use {{.VariableName}} for dynamic values`}
            />

            {/* Font Size */}
            <NumberInput
                label="Font Size (pt)"
                value={props.fontSize}
                onChange={(fontSize) => handleChange({ fontSize })}
                min={6}
                max={72}
            />

            {/* Font Weight */}
            <Select
                label="Font Weight"
                value={props.fontWeight}
                onChange={(e) => handleChange({ fontWeight: e.target.value as 'normal' | 'bold' })}
                options={[
                    { value: 'normal', label: 'Normal' },
                    { value: 'bold', label: 'Bold' },
                ]}
            />

            {/* Alignment */}
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

            {/* Color */}
            <ColorInput
                label="Color"
                value={props.color}
                onChange={(color) => handleChange({ color })}
            />

            {/* Insert Variable */}
            <VariableSelector onSelect={handleVariableInsert} />
        </div>
    );
}
