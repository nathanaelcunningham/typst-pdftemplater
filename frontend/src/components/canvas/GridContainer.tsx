import { useTemplateStore } from '../../store/templateStore';
import { ComponentWrapper } from './ComponentWrapper';
import { DropZone } from './DropZone';

export function GridContainer() {
  const components = useTemplateStore((state) => state.components);
  const gridConfig = useTemplateStore((state) => state.grid);

  // Group components by row
  const componentsByRow: Record<number, typeof components> = {};
  components.forEach((component) => {
    const row = component.position.row;
    if (!componentsByRow[row]) {
      componentsByRow[row] = [];
    }
    componentsByRow[row].push(component);
  });

  // Get all unique rows and sort them
  const rows = Object.keys(componentsByRow)
    .map(Number)
    .sort((a, b) => a - b);

  // If no components, show a single drop zone for the first row
  if (components.length === 0) {
    return (
      <div className="min-h-[400px]">
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-lg font-medium mb-2">Start Building Your Template</p>
          <p className="text-sm">Drag components from the left sidebar to begin</p>
        </div>
        <DropZone position={{ row: 0, column: 0, span: 12 }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rows.map((rowIndex) => {
        const rowComponents = componentsByRow[rowIndex] || [];

        // Sort components by column
        const sortedComponents = [...rowComponents].sort(
          (a, b) => a.position.column - b.position.column
        );

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
              {sortedComponents.map((component) => (
                <div
                  key={component.id}
                  style={{
                    gridColumn: `${component.position.column + 1} / span ${component.position.span}`,
                  }}
                >
                  <ComponentWrapper component={component} />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Drop zone for new row at the end */}
      <DropZone position={{ row: rows.length > 0 ? rows[rows.length - 1] + 1 : 0, column: 0, span: 12 }} />
    </div>
  );
}
