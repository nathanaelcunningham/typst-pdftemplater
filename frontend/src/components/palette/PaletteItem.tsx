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
            className={`flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-grab hover:bg-gray-100 hover:border-gray-300 transition-colors ${isDragging ? 'opacity-50' : ''
                }`}
        >
            <span className="text-2xl">{icon}</span>
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
    );
}
