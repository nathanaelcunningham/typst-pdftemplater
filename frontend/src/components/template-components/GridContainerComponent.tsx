import type { ComponentInstance } from '../../types/template';
import type { GridContainerProps } from '../../types/components';
import { hasGridPosition } from '../../types/template';
import { ComponentWrapper } from '../canvas/ComponentWrapper';
import { DropZone } from '../canvas/DropZone';
import { useTemplateStore } from '../../store/templateStore';

interface GridContainerComponentRenderProps {
    component: ComponentInstance;
    isSelected?: boolean;
    onClick?: () => void;
}

// Helper function to calculate which cells are empty
function calculateEmptyCells(children: ComponentInstance[], numColumns: number): number[] {
    const occupiedCols = new Set<number>();

    children.forEach(child => {
        if (hasGridPosition(child.position)) {
            for (let i = 0; i < child.position.span; i++) {
                occupiedCols.add(child.position.columnIndex + i);
            }
        }
    });

    const empty: number[] = [];
    for (let col = 0; col < numColumns; col++) {
        if (!occupiedCols.has(col)) {
            empty.push(col);
        }
    }

    return empty;
}

export function GridContainerComponent({ component, isSelected, onClick }: GridContainerComponentRenderProps) {
    const props = component.props as GridContainerProps;
    const children = component.children || [];
    const isDragging = useTemplateStore((state) => state.isDragging);

    const numColumns = props.columns.length;
    const emptyCells = calculateEmptyCells(children, numColumns);
    const isGridFull = emptyCells.length === 0;

    return (
        <div
            onClick={onClick}
            className={`relative border-2 rounded-lg p-4 ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
            }`}
        >
            {/* Label */}
            <div className="absolute -top-3 left-2 bg-white px-2 py-0.5 text-xs font-medium text-gray-600 border border-gray-300 rounded">
                Grid Container ({numColumns} col{numColumns !== 1 ? 's' : ''})
            </div>

            {/* Empty state */}
            {children.length === 0 && !isDragging && (
                <div className="min-h-[100px] flex items-center justify-center text-xs text-gray-400">
                    Empty container - drag components here
                </div>
            )}

            {/* Grid layout with children and drop zones */}
            {(children.length > 0 || (children.length === 0 && isDragging)) && (
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: props.columns.map(f => `${f}fr`).join(' '),
                        gap: `${props.rowGap || props.gap}px ${props.gap}px`,
                        minHeight: children.length === 0 ? '100px' : 'auto',
                    }}
                >
                    {/* Render children with explicit grid positioning */}
                    {children.map(child => {
                        if (!hasGridPosition(child.position)) return null;
                        const pos = child.position;

                        return (
                            <div
                                key={child.id}
                                style={{
                                    gridColumn: `${pos.columnIndex + 1} / span ${pos.span}`
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ComponentWrapper component={child} />
                            </div>
                        );
                    })}

                    {/* Render drop zones in empty cells when dragging */}
                    {isDragging && emptyCells.map(cellIndex => (
                        <div
                            key={`dropzone-${cellIndex}`}
                            style={{ gridColumn: cellIndex + 1 }}
                        >
                            <DropZone
                                dropZoneType="grid-cell"
                                targetComponentId={component.id}
                                gridCellIndex={cellIndex}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Overflow drop zone when grid is full */}
            {isDragging && isGridFull && children.length > 0 && (
                <div className="mt-2">
                    <DropZone
                        dropZoneType="grid-overflow"
                        targetComponentId={component.id}
                    />
                </div>
            )}
        </div>
    );
}
