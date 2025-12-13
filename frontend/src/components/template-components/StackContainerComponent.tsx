import type { ComponentInstance } from '../../types/template';
import type { StackContainerProps } from '../../types/components';
import { hasRelativePosition } from '../../types/template';
import { ComponentWrapper } from '../canvas/ComponentWrapper';
import { DropZone } from '../canvas/DropZone';
import { useTemplateStore } from '../../store/templateStore';

interface StackContainerComponentRenderProps {
    component: ComponentInstance;
    isSelected?: boolean;
    onClick?: () => void;
}

export function StackContainerComponent({ component, isSelected, onClick }: StackContainerComponentRenderProps) {
    const props = component.props as StackContainerProps;
    const children = component.children || [];
    const isDragging = useTemplateStore((state) => state.isDragging);

    // Sort children by relative index
    const sorted = [...children].sort((a, b) => {
        const aIdx = hasRelativePosition(a.position) ? a.position.index : 0;
        const bIdx = hasRelativePosition(b.position) ? b.position.index : 0;
        return aIdx - bIdx;
    });

    return (
        <div
            onClick={onClick}
            className={`relative border-2 rounded-lg p-4 ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-purple-300 bg-purple-50'
            }`}
        >
            {/* Label */}
            <div className="absolute -top-3 left-2 bg-white px-2 py-0.5 text-xs font-medium text-gray-600 border border-gray-300 rounded">
                Stack Container ({props.direction})
            </div>

            {/* Stack layout or drop zone when empty */}
            {sorted.length === 0 && isDragging ? (
                <div className="min-h-[100px]">
                    <DropZone dropZoneType="container-interior" targetComponentId={component.id} />
                </div>
            ) : sorted.length === 0 ? (
                <div className="min-h-[100px] flex items-center justify-center text-xs text-gray-400">
                    Empty container - drag components here
                </div>
            ) : (
                <div
                    className={`flex ${props.direction === 'vertical' ? 'flex-col' : 'flex-row'}`}
                    style={{
                        gap: `${props.spacing}px`,
                        alignItems: props.alignment === 'center' ? 'center' : props.alignment === 'right' ? 'flex-end' : 'flex-start',
                    }}
                >
                    {sorted.map(child => (
                        <div key={child.id} onClick={(e) => e.stopPropagation()}>
                            <ComponentWrapper component={child} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
