import type { ComponentInstance } from '../../types/template';
import type { TextComponentProps } from '../../types/components';
import { useTemplateStore } from '../../store/templateStore';
import { VariableSelector } from './VariableSelector';
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
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                    ref={textareaRef}
                    value={props.content}
                    onChange={(e) => handleChange({ content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Enter text content..."
                />
                <p className="text-xs text-gray-500 mt-1">
                    Use {`{{.VariableName}}`} for dynamic values
                </p>
            </div>

            {/* Font Size */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Size (pt)</label>
                <input
                    type="number"
                    value={props.fontSize}
                    onChange={(e) => handleChange({ fontSize: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="6"
                    max="72"
                />
            </div>

            {/* Font Weight */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
                <select
                    value={props.fontWeight}
                    onChange={(e) => handleChange({ fontWeight: e.target.value as 'normal' | 'bold' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                </select>
            </div>

            {/* Alignment */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
                <select
                    value={props.alignment}
                    onChange={(e) => handleChange({ alignment: e.target.value as 'left' | 'center' | 'right' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select>
            </div>

            {/* Color */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={props.color}
                        onChange={(e) => handleChange({ color: e.target.value })}
                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                        type="text"
                        value={props.color}
                        onChange={(e) => handleChange({ color: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#000000"
                    />
                </div>
            </div>

            {/* Insert Variable */}
            <VariableSelector onSelect={handleVariableInsert} />
        </div>
    );
}
