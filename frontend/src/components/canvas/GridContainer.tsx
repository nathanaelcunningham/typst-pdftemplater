import { useTemplateStore } from '../../store/templateStore';
import { hasAbsolutePosition, type ComponentInstance } from '../../types/template';
import { ComponentWrapper } from './ComponentWrapper';
import { DropZone } from './DropZone';
import { EmptyState } from '../ui';
import { Page } from './Page';

// Group components into pages based on page-break components
function groupComponentsByPage(components: ComponentInstance[]) {
    // Filter to only top-level components (those with absolute positions)
    const topLevelComponents = components.filter(c => hasAbsolutePosition(c.position));

    // Sort by row
    const sorted = [...topLevelComponents].sort((a, b) => {
        if (hasAbsolutePosition(a.position) && hasAbsolutePosition(b.position)) {
            return a.position.row - b.position.row;
        }
        return 0;
    });

    // Split into pages at page-break components
    const pages: ComponentInstance[][] = [];
    let currentPage: ComponentInstance[] = [];

    sorted.forEach((component) => {
        if (component.type === 'page-break') {
            // Add page break to current page and start new page
            currentPage.push(component);
            pages.push(currentPage);
            currentPage = [];
        } else {
            currentPage.push(component);
        }
    });

    // Always add the final page (even if empty after a page break)
    pages.push(currentPage);

    // Ensure at least one page exists
    if (pages.length === 0) {
        pages.push([]);
    }

    return pages;
}

export function GridContainer() {
    const components = useTemplateStore((state) => state.components);
    const gridConfig = useTemplateStore((state) => state.grid);

    // Group components into pages
    const pages = groupComponentsByPage(components);

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

    // If no components, show a single empty page with drop zone
    if (topLevelComponents.length === 0) {
        return (
            <Page pageNumber={1}>
                <EmptyState
                    icon="📄"
                    message="Start Building Your Template"
                    helperText="Drag components from the left sidebar to begin"
                    className="text-gray-400"
                />
                <DropZone position={{ type: 'absolute', row: 0, column: 0, span: 12 }} dropZoneType="canvas-empty" />
            </Page>
        );
    }

    // Render each page
    return (
        <div className="space-y-8">
            {pages.map((pageComponents, pageIndex) => {
                // Group components in this page by row
                const pageComponentsByRow: Record<number, typeof pageComponents> = {};
                pageComponents.forEach((component) => {
                    if (hasAbsolutePosition(component.position)) {
                        const row = component.position.row;
                        if (!pageComponentsByRow[row]) {
                            pageComponentsByRow[row] = [];
                        }
                        pageComponentsByRow[row].push(component);
                    }
                });

                const pageRows = Object.keys(pageComponentsByRow)
                    .map(Number)
                    .sort((a, b) => a - b);

                return (
                    <Page key={pageIndex} pageNumber={pageIndex + 1}>
                        <div className="space-y-4">
                            {pageRows.map((rowIndex) => {
                                const rowComponents = pageComponentsByRow[rowIndex] || [];

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

                            {/* Drop zone for new row at the end of last page */}
                            {pageIndex === pages.length - 1 && (
                                <DropZone
                                    position={{ type: 'absolute', row: rows.length > 0 ? rows[rows.length - 1] + 1 : 0, column: 0, span: 12 }}
                                    dropZoneType="canvas-new-row"
                                />
                            )}
                        </div>
                    </Page>
                );
            })}
        </div>
    );
}
