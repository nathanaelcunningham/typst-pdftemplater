// Core template data types

export type ComponentType = 'text' | 'image' | 'table' | 'grid-container' | 'stack-container';

// Discriminated union for position types
export type Position = AbsolutePosition | RelativePosition | GridPosition;

export interface AbsolutePosition {
    type: 'absolute';
    row: number;          // Row in global grid (0-indexed)
    column: number;       // Starting column (0-11)
    span: number;         // Column span (1-12)
}

export interface RelativePosition {
    type: 'relative';
    index: number;        // Order within container (0-indexed)
}

export interface GridPosition {
    type: 'grid';
    columnIndex: number;  // Starting column in grid container (0-indexed)
    span: number;         // Number of columns to span (default: 1)
}

export interface ComponentInstance {
    id: string;
    type: ComponentType;
    position: Position;
    props: Record<string, any>;  // Component-specific properties
    children?: ComponentInstance[];  // Only for containers
}

export interface Variable {
    id: string;
    name: string;           // Display name (e.g., "Customer Name")
    path: string;           // Variable path (e.g., "CustomerName") - dot prefix added during Typst generation
    type: 'string' | 'number' | 'date' | 'array';
    description?: string;
}

export interface VariableValue {
    variableId: string;     // ID of variable in VariableManager
    value: string;          // User input value
}

export interface PreviewState {
    isLoading: boolean;
    pdfUrl: string | null;  // Blob URL for compiled PDF
    error: string | null;   // Compilation error message
    variableValues: VariableValue[];
}

export interface GridConfig {
    columns: number;  // Number of columns (default: 12)
    gap: number;      // Gap between columns in pixels (default: 16)
}

export interface TemplateState {
    grid: GridConfig;
    components: ComponentInstance[];
    variables: Variable[];
    selectedComponentId: string | null;
    isDragging: boolean;
    preview: PreviewState;
}

// Drop zone types
export type DropZoneType =
    | 'canvas-empty'           // Empty canvas
    | 'canvas-new-row'         // New row below existing
    | 'container-interior'     // Inside container
    | 'component-above'        // Above existing (blue line)
    | 'component-below'        // Below existing (blue line)
    | 'component-left'         // Left of component (purple - auto-wrap)
    | 'component-right'        // Right of component (purple - auto-wrap)
    | 'grid-cell'              // Specific cell in grid container
    | 'grid-overflow';         // Grid is full, add new column

// Type guards
export function isContainer(component: ComponentInstance): boolean {
    return component.type === 'grid-container' || component.type === 'stack-container';
}

export function hasAbsolutePosition(pos: Position): pos is AbsolutePosition {
    return pos.type === 'absolute';
}

export function hasRelativePosition(pos: Position): pos is RelativePosition {
    return pos.type === 'relative';
}

export function hasGridPosition(pos: Position): pos is GridPosition {
    return pos.type === 'grid';
}
