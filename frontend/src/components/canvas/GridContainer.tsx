import { useTemplateStore } from '../../store/templateStore';
import { hasAbsolutePosition } from '../../types/template';
import { ComponentWrapper } from './ComponentWrapper';
import { DropZone } from './DropZone';

export function GridContainer() {
    const components = useTemplateStore((state) => state.components);
    const gridConfig = useTemplateStore((state) => state.grid);

    // Filter to only top-level components (those with absolute positions)
    const topLevelComponents = components.filter(c => hasAbsolutePosition(c.position));

    // Group components by row
    const componentsByRow: Record<number, typeof topLevelComponents> = {};
    topLevelComponents.forEach((component) => {
        if (hasAbsolutePosition(component.position)) {
            const row = component.position.row;
            if (!componentsByRow[row]) {
                componentsByRow[row] = [];
            }
            componentsByRow[row].push(component);
        }
    });

    // Get all unique rows and sort them
    const rows = Object.keys(componentsByRow)
        .map(Number)
        .sort((a, b) => a - b);

    // If no components, show a single drop zone for the first row
    if (topLevelComponents.length === 0) {
        return (
            <div className="h-full">
                <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-lg font-medium mb-2">Start Building Your Template</p>
                    <p className="text-sm">Drag components from the left sidebar to begin</p>
                </div>
                <DropZone position={{ type: 'absolute', row: 0, column: 0, span: 12 }} dropZoneType="canvas-empty" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {rows.map((rowIndex) => {
                const rowComponents = componentsByRow[rowIndex] || [];

                // Sort components by column
                const sortedComponents = [...rowComponents].sort((a, b) => {
                    const aCol = hasAbsolutePosition(a.position) ? a.position.column : 0;
                    const bCol = hasAbsolutePosition(b.position) ? b.position.column : 0;
                    return aCol - bCol;
                });

                return (
                    <div key={rowIndex} className="relative">
                        {/* Row with grid layout */}
                        <div
                            className="grid"
                            style={{
                                gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
                                gap: `${gridConfig.gap}px`,
                            }}
                        >
                            {sortedComponents.map((component) => {
                                if (hasAbsolutePosition(component.position)) {
                                    return (
                                        <div
                                            key={component.id}
                                            style={{
                                                gridColumn: `${component.position.column + 1} / span ${component.position.span}`,
                                            }}
                                        >
                                            <ComponentWrapper component={component} />
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                );
            })}

            {/* Drop zone for new row at the end */}
            <DropZone position={{ type: 'absolute', row: rows.length > 0 ? rows[rows.length - 1] + 1 : 0, column: 0, span: 12 }} dropZoneType="canvas-new-row" />
        </div>
    );
}
