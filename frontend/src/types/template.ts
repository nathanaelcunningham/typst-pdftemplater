// Core template data types

export type ComponentType = 'text' | 'image' | 'table';

export interface Position {
  row: number;      // Which row (0-indexed)
  column: number;   // Starting column (0-indexed, 0-11 for 12-column grid)
  span: number;     // How many columns to span (1-12)
}

export interface ComponentInstance {
  id: string;
  type: ComponentType;
  position: Position;
  props: Record<string, any>;  // Component-specific properties
}

export interface Variable {
  id: string;
  name: string;           // Display name (e.g., "Customer Name")
  path: string;           // Go template path (e.g., ".CustomerName")
  type: 'string' | 'number' | 'date' | 'array';
  description?: string;
  example?: string;       // Example value for preview
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
}
