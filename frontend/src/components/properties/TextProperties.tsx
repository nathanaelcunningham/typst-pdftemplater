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
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Content</label>
                <textarea
                    ref={textareaRef}
                    value={props.content}
                    onChange={(e) => handleChange({ content: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                    rows={4}
                    placeholder="Enter text content..."
                />
                <p className="text-xs text-slate-lighter mt-1.5">
                    Use {`{{.VariableName}}`} for dynamic values
                </p>
            </div>

            {/* Font Size */}
            <div>
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Font Size (pt)</label>
                <input
                    type="number"
                    value={props.fontSize}
                    onChange={(e) => handleChange({ fontSize: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                    min="6"
                    max="72"
                />
            </div>

            {/* Font Weight */}
            <div>
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Font Weight</label>
                <select
                    value={props.fontWeight}
                    onChange={(e) => handleChange({ fontWeight: e.target.value as 'normal' | 'bold' })}
                    className="w-full px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                </select>
            </div>

            {/* Alignment */}
            <div>
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Alignment</label>
                <select
                    value={props.alignment}
                    onChange={(e) => handleChange({ alignment: e.target.value as 'left' | 'center' | 'right' })}
                    className="w-full px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select>
            </div>

            {/* Color */}
            <div>
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Color</label>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={props.color}
                        onChange={(e) => handleChange({ color: e.target.value })}
                        className="h-10 w-16 border-2 border-cream-dark rounded cursor-pointer"
                    />
                    <input
                        type="text"
                        value={props.color}
                        onChange={(e) => handleChange({ color: e.target.value })}
                        className="flex-1 px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink font-mono focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                        placeholder="#000000"
                    />
                </div>
            </div>

            {/* Insert Variable */}
            <VariableSelector onSelect={handleVariableInsert} />
        </div>
    );
}
