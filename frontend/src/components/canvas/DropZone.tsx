import { useDroppable } from '@dnd-kit/core';
import type { AbsolutePosition, DropZoneType } from '../../types/template';
import { useTemplateStore } from '../../store/templateStore';

interface DropZoneProps {
    position?: AbsolutePosition;  // For absolute position drops
    dropZoneType: DropZoneType;
    targetComponentId?: string;   // For component-relative drops
    gridCellIndex?: number;       // For grid-cell drops
}

export function DropZone({ position, dropZoneType, targetComponentId, gridCellIndex }: DropZoneProps) {
    const isDragging = useTemplateStore((state) => state.isDragging);

    const dropId = gridCellIndex !== undefined
        ? `drop-zone-${dropZoneType}-${targetComponentId}-cell-${gridCellIndex}`
        : targetComponentId
            ? `drop-zone-${dropZoneType}-${targetComponentId}`
            : position
                ? `drop-zone-${dropZoneType}-${position.row}-${position.column}`
                : `drop-zone-${dropZoneType}`;

    const { setNodeRef, isOver } = useDroppable({
        id: dropId,
        data: {
            type: dropZoneType,
            position,
            targetComponentId,
            gridCellIndex,
        },
    });

    // Only show drop zone when dragging
    if (!isDragging) {
        return null;
    }

    // Edge-based drop zones (thin lines)
    if (dropZoneType === 'component-above' || dropZoneType === 'component-below') {
        return (
            <div
                ref={setNodeRef}
                className={`h-2 -my-1 transition-all ${
                    isOver
                        ? 'bg-blue-500'
                        : 'bg-blue-300 opacity-50 hover:opacity-100'
                }`}
            />
        );
    }

    if (dropZoneType === 'component-left' || dropZoneType === 'component-right') {
        return (
            <div
                ref={setNodeRef}
                className={`w-2 -mx-1 transition-all ${
                    isOver
                        ? 'bg-purple-500'
                        : 'bg-purple-300 opacity-50 hover:opacity-100'
                }`}
            />
        );
    }

    // Grid cell drop zone
    if (dropZoneType === 'grid-cell') {
        return (
            <div
                ref={setNodeRef}
                className={`min-h-[80px] border-2 border-dashed rounded transition-all flex items-center justify-center ${
                    isOver
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-25'
                }`}
            >
                <div className="text-2xl text-gray-400">
                    {isOver ? '↓' : '+'}
                </div>
            </div>
        );
    }

    // Grid overflow drop zone (add new column)
    if (dropZoneType === 'grid-overflow') {
        return (
            <div
                ref={setNodeRef}
                className={`p-3 border-2 border-dashed rounded transition-all ${
                    isOver
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-orange-300 bg-orange-50/50 hover:border-orange-400'
                }`}
            >
                <div className="text-xs text-center text-orange-700 font-medium">
                    {isOver ? 'Drop to add new column →' : 'Grid full - drop here to add column'}
                </div>
            </div>
        );
    }

    // Canvas drop zones (larger areas)
    return (
        <div
            ref={setNodeRef}
            className={`min-h-[100px] border-2 border-dashed rounded-lg transition-all ${
                isOver
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
