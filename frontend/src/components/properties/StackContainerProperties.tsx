import type { ComponentInstance } from '../../types/template';
import type { StackContainerProps } from '../../types/components';
import { useTemplateStore } from '../../store/templateStore';

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
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Stack Container</h3>
                <button
                    onClick={handleUnwrap}
                    className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
                >
                    Unwrap
                </button>
            </div>

            {/* Direction */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
                <select
                    value={props.direction}
                    onChange={(e) => handleChange({ direction: e.target.value as 'vertical' | 'horizontal' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="vertical">Vertical (Top to Bottom)</option>
                    <option value="horizontal">Horizontal (Left to Right)</option>
                </select>
            </div>

            {/* Spacing */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spacing (pt)</label>
                <input
                    type="number"
                    value={props.spacing}
                    onChange={(e) => handleChange({ spacing: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                />
            </div>

            {/* Alignment */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
                <select
                    value={props.alignment || 'left'}
                    onChange={(e) => handleChange({ alignment: e.target.value as 'left' | 'center' | 'right' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select>
            </div>

            <p className="text-xs text-gray-500">
                This container stacks its children {props.direction === 'vertical' ? 'vertically' : 'horizontally'} with the specified spacing.
            </p>
        </div>
    );
}
