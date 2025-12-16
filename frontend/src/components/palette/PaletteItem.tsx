import { useDraggable } from '@dnd-kit/core';
import type { ComponentType } from '../../types/template';

interface PaletteItemProps {
    type: ComponentType;
    label: string;
    icon: string;
}

export function PaletteItem({ type, label, icon }: PaletteItemProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `palette-${type}`,
        data: {
            type: 'palette-item',
            componentType: type,
        },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`group flex items-center gap-3 p-3.5 bg-cream/50 border-2 border-cream-dark rounded-lg cursor-grab hover:bg-amber/10 hover:border-amber/40 hover:shadow-md active:scale-98 transition-all ${isDragging ? 'opacity-50 scale-95' : ''
                }`}
        >
            <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
            <span className="text-sm font-medium text-ink group-hover:text-amber-dark transition-colors">{label}</span>
        </div>
    );
}
