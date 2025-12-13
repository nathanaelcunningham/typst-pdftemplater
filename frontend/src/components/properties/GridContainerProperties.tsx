import type { ComponentInstance } from '../../types/template';
import type { GridContainerProps } from '../../types/components';
import { hasGridPosition } from '../../types/template';
import { useTemplateStore } from '../../store/templateStore';

interface GridContainerPropertiesProps {
    component: ComponentInstance;
}

export function GridContainerProperties({ component }: GridContainerPropertiesProps) {
    const {
        updateContainerProps,
        unwrapContainer,
        addGridColumn,
        removeGridColumn,
        updateGridColumnWidth,
        updateChildGridPosition,
        canRemoveGridColumn,
    } = useTemplateStore();

    const props = component.props as GridContainerProps;
    const children = component.children || [];

    const handleChange = (updates: Partial<GridContainerProps>) => {
        updateContainerProps(component.id, updates);
    };

    const handleUnwrap = () => {
        unwrapContainer(component.id);
    };

    return (
        <div className="space-y-4">
            {/* Header with unwrap button */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Grid Container</h3>
                <button
                    onClick={handleUnwrap}
                    className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
                >
                    Unwrap
                </button>
            </div>

            {/* Column Management */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Columns</label>
                    <button
                        onClick={() => addGridColumn(component.id, 1)}
                        className="px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100"
                    >
                        + Add Column
                    </button>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                    Fractional units (e.g., [1, 2, 1] = 25%, 50%, 25%)
                </p>
                <div className="space-y-2">
                    {props.columns.map((col, idx) => {
                        const validation = canRemoveGridColumn(component.id, idx);

                        return (
                            <div key={idx} className="flex gap-2 items-center">
                                <span className="text-xs text-gray-600 w-12">Col {idx + 1}</span>
                                <input
                                    type="number"
                                    value={col}
                                    onChange={(e) => updateGridColumnWidth(component.id, idx, Number(e.target.value))}
                                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                />
                                <span className="text-xs text-gray-500 w-6">fr</span>
                                <button
                                    onClick={() => removeGridColumn(component.id, idx)}
                                    disabled={!validation.canRemove}
                                    title={validation.reason}
                                    className={`px-2 py-1 text-xs font-medium rounded ${validation.canRemove
                                        ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                        : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                        }`}
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Gap */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horizontal Gap (pt)</label>
                <input
                    type="number"
                    value={props.gap}
                    onChange={(e) => handleChange({ gap: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                />
            </div>

            {/* Row Gap */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vertical Gap (pt)</label>
                <input
                    type="number"
                    value={props.rowGap || 0}
                    onChange={(e) => handleChange({ rowGap: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    placeholder="Same as horizontal"
                />
            </div>

            {/* Alignment */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vertical Alignment</label>
                <select
                    value={props.alignment || 'start'}
                    onChange={(e) => handleChange({ alignment: e.target.value as 'start' | 'center' | 'end' | 'stretch' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="start">Start</option>
                    <option value="center">Center</option>
                    <option value="end">End</option>
                    <option value="stretch">Stretch</option>
                </select>
            </div>

            {/* Child Component Positioning */}
            {children.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Component Positions</label>
                    <div className="space-y-3">
                        {children.map((child) => {
                            if (!hasGridPosition(child.position)) return null;

                            return (
                                <div key={child.id} className="border border-gray-200 rounded p-2 space-y-2 bg-gray-50">
                                    <div className="text-xs font-medium text-gray-700 capitalize">
                                        {child.type.replace('-', ' ')}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Column</label>
                                            <input
                                                type="number"
                                                value={child.position.columnIndex}
                                                onChange={(e) => {
                                                    updateChildGridPosition(component.id, child.id, {
                                                        ...child.position,
                                                        columnIndex: Number(e.target.value),
                                                    });
                                                }}
                                                min={0}
                                                max={props.columns.length - 1}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Span</label>
                                            <input
                                                type="number"
                                                value={child.position.span}
                                                onChange={(e) => {
                                                    updateChildGridPosition(component.id, child.id, {
                                                        ...child.position,
                                                        span: Number(e.target.value),
                                                    });
                                                }}
                                                min={1}
                                                max={props.columns.length - child.position.columnIndex}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <p className="text-xs text-gray-500">
                This container arranges its children in a grid layout. Drop components into empty cells or use the controls above to manage layout.
            </p>
        </div>
    );
}
