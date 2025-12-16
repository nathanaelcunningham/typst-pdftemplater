import type { ComponentInstance } from '../../types/template';
import type { ImageComponentProps } from '../../types/components';
import { useTemplateStore } from '../../store/templateStore';
import { VariableSelector } from './VariableSelector';

interface ImagePropertiesProps {
    component: ComponentInstance;
}

export function ImageProperties({ component }: ImagePropertiesProps) {
    const updateComponent = useTemplateStore((state) => state.updateComponent);
    const props = component.props as ImageComponentProps;

    const handleChange = (updates: Partial<ImageComponentProps>) => {
        updateComponent(component.id, {
            props: { ...props, ...updates },
        });
    };

    const handleVariableInsert = (variablePath: string) => {
        handleChange({ source: variablePath });
    };

    return (
        <div className="space-y-4">
            {/* Source */}
            <div>
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Image Source</label>
                <input
                    type="text"
                    value={props.source}
                    onChange={(e) => handleChange({ source: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                    placeholder="URL or {{.Variable}}"
                />
                <p className="text-xs text-slate-lighter mt-1.5">
                    Enter image URL or use {`{{.Variable}}`} for dynamic images
                </p>
            </div>

            {/* Width */}
            <div>
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Width</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={props.width === 'auto' ? '' : props.width}
                        onChange={(e) =>
                            handleChange({ width: e.target.value === '' ? 'auto' : Number(e.target.value) })
                        }
                        className="flex-1 px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                        placeholder="Auto"
                    />
                    <span className="flex items-center text-sm text-slate-lighter">pt</span>
                </div>
            </div>

            {/* Height */}
            <div>
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Height</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={props.height === 'auto' ? '' : props.height}
                        onChange={(e) =>
                            handleChange({ height: e.target.value === '' ? 'auto' : Number(e.target.value) })
                        }
                        className="flex-1 px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                        placeholder="Auto"
                    />
                    <span className="flex items-center text-sm text-slate-lighter">pt</span>
                </div>
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

            {/* Alt Text */}
            <div>
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Alt Text</label>
                <input
                    type="text"
                    value={props.alt}
                    onChange={(e) => handleChange({ alt: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                    placeholder="Image description"
                />
            </div>

            {/* Insert Variable */}
            <VariableSelector onSelect={handleVariableInsert} />
        </div>
    );
}
