import { useDroppable } from '@dnd-kit/core';
import type { Position } from '../../types/template';
import { useTemplateStore } from '../../store/templateStore';

interface DropZoneProps {
    position: Position;
}

export function DropZone({ position }: DropZoneProps) {
    const isDragging = useTemplateStore((state) => state.isDragging);

    const { setNodeRef, isOver } = useDroppable({
        id: `drop-zone-${position.row}-${position.column}`,
        data: {
            type: 'canvas-drop-zone',
            position,
        },
    });

    // Only show drop zone when dragging
    if (!isDragging) {
        return null;
    }

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[100px] border-2 border-dashed rounded-lg transition-all ${isOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
        >
            <div className="flex items-center justify-center h-full text-sm text-gray-400">
                {isOver ? 'Drop here' : 'Drop component here'}
            </div>
        </div>
    );
}
