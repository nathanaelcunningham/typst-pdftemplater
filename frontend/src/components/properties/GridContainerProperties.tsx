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
            <div className="flex items-center justify-between p-3 bg-amber/10 border-2 border-amber/30 rounded-lg">
                <h3 className="text-sm font-serif font-semibold text-charcoal">Grid Container</h3>
                <button
                    onClick={handleUnwrap}
                    className="px-3 py-1.5 text-xs font-medium text-danger bg-danger/10 border border-danger/30 rounded hover:bg-danger/20 active:scale-95 transition-all"
                >
                    Unwrap
                </button>
            </div>

            {/* Column Management */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-light uppercase tracking-wider">Columns</label>
                    <button
                        onClick={() => addGridColumn(component.id, 1)}
                        className="px-3 py-1.5 text-xs font-medium text-charcoal bg-success/20 border border-success/40 rounded hover:bg-success/30 active:scale-95 transition-all"
                    >
                        + Add Column
                    </button>
                </div>
                <p className="text-xs text-slate-lighter mb-2">
                    Fractional units (e.g., [1, 2, 1] = 25%, 50%, 25%)
                </p>
                <div className="space-y-2">
                    {props.columns.map((col, idx) => {
                        const validation = canRemoveGridColumn(component.id, idx);

                        return (
                            <div key={idx} className="flex gap-2 items-center">
                                <span className="text-xs text-slate-light w-12">Col {idx + 1}</span>
                                <input
                                    type="number"
                                    value={col}
                                    onChange={(e) => updateGridColumnWidth(component.id, idx, Number(e.target.value))}
                                    className="flex-1 px-2 py-1.5 border-2 border-cream-dark rounded text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                                    min="1"
                                />
                                <span className="text-xs text-slate-lighter w-6">fr</span>
                                <button
                                    onClick={() => removeGridColumn(component.id, idx)}
                                    disabled={!validation.canRemove}
                                    title={validation.reason}
                                    className={`px-2 py-1 text-xs font-medium rounded transition-all ${validation.canRemove
                                        ? 'text-danger bg-danger/10 hover:bg-danger/20 active:scale-95'
                                        : 'text-slate-lighter bg-cream-dark cursor-not-allowed'
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
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Horizontal Gap (pt)</label>
                <input
                    type="number"
                    value={props.gap}
                    onChange={(e) => handleChange({ gap: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                    min="0"
                />
            </div>

            {/* Row Gap */}
            <div>
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Vertical Gap (pt)</label>
                <input
                    type="number"
                    value={props.rowGap || 0}
                    onChange={(e) => handleChange({ rowGap: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                    min="0"
                    placeholder="Same as horizontal"
                />
            </div>

            {/* Alignment */}
            <div>
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Vertical Alignment</label>
                <select
                    value={props.alignment || 'start'}
                    onChange={(e) => handleChange({ alignment: e.target.value as 'start' | 'center' | 'end' | 'stretch' })}
                    className="w-full px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
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
                    <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Component Positions</label>
                    <div className="space-y-3">
                        {children.map((child) => {
                            if (!hasGridPosition(child.position)) return null;

                            return (
                                <div key={child.id} className="border-2 border-cream-dark rounded p-3 space-y-2 bg-cream/30">
                                    <div className="text-xs font-medium text-ink capitalize">
                                        {child.type.replace('-', ' ')}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-slate-light mb-1">Column</label>
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
                                                className="w-full px-2 py-1.5 border-2 border-cream-dark rounded text-xs bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-light mb-1">Span</label>
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
                                                className="w-full px-2 py-1.5 border-2 border-cream-dark rounded text-xs bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <p className="text-xs text-slate-lighter">
                This container arranges its children in a grid layout. Drop components into empty cells or use the controls above to manage layout.
            </p>
        </div>
    );
}
