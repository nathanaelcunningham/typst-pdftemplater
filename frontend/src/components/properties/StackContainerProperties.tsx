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
            <div className="flex items-center justify-between p-3 bg-amber/10 border-2 border-amber/30 rounded-lg">
                <h3 className="text-sm font-serif font-semibold text-charcoal">Stack Container</h3>
                <button
                    onClick={handleUnwrap}
                    className="px-3 py-1.5 text-xs font-medium text-danger bg-danger/10 border border-danger/30 rounded hover:bg-danger/20 active:scale-95 transition-all"
                >
                    Unwrap
                </button>
            </div>

            {/* Direction */}
            <div>
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Direction</label>
                <select
                    value={props.direction}
                    onChange={(e) => handleChange({ direction: e.target.value as 'vertical' | 'horizontal' })}
                    className="w-full px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                >
                    <option value="vertical">Vertical (Top to Bottom)</option>
                    <option value="horizontal">Horizontal (Left to Right)</option>
                </select>
            </div>

            {/* Spacing */}
            <div>
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Spacing (pt)</label>
                <input
                    type="number"
                    value={props.spacing}
                    onChange={(e) => handleChange({ spacing: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                    min="0"
                />
            </div>

            {/* Alignment */}
            <div>
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Alignment</label>
                <select
                    value={props.alignment || 'left'}
                    onChange={(e) => handleChange({ alignment: e.target.value as 'left' | 'center' | 'right' })}
                    className="w-full px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select>
            </div>

            <p className="text-xs text-slate-lighter">
                This container stacks its children {props.direction === 'vertical' ? 'vertically' : 'horizontally'} with the specified spacing.
            </p>
        </div>
    );
}
