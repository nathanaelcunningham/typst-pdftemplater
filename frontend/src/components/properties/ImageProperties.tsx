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
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Source</label>
                <input
                    type="text"
                    value={props.source}
                    onChange={(e) => handleChange({ source: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="URL or {{.Variable}}"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Enter image URL or use {`{{.Variable}}`} for dynamic images
                </p>
            </div>

            {/* Width */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={props.width === 'auto' ? '' : props.width}
                        onChange={(e) =>
                            handleChange({ width: e.target.value === '' ? 'auto' : Number(e.target.value) })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Auto"
                    />
                    <span className="flex items-center text-sm text-gray-500">pt</span>
                </div>
            </div>

            {/* Height */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={props.height === 'auto' ? '' : props.height}
                        onChange={(e) =>
                            handleChange({ height: e.target.value === '' ? 'auto' : Number(e.target.value) })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Auto"
                    />
                    <span className="flex items-center text-sm text-gray-500">pt</span>
                </div>
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

            {/* Alt Text */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                    type="text"
                    value={props.alt}
                    onChange={(e) => handleChange({ alt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Image description"
                />
            </div>

            {/* Insert Variable */}
            <VariableSelector onSelect={handleVariableInsert} />
        </div>
    );
}
