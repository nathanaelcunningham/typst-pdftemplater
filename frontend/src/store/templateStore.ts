import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ComponentInstance, Variable, Position, TemplateState, GridPosition } from '../types/template';
import { hasGridPosition, hasRelativePosition } from '../types/template';
import type { GridContainerProps, StackContainerProps } from '../types/components';
import { defaultGridContainerProps, defaultStackContainerProps } from '../types/components';

interface TemplateStore extends TemplateState {
    // Component actions
    addComponent: (component: ComponentInstance) => void;
    updateComponent: (id: string, updates: Partial<ComponentInstance>) => void;
    removeComponent: (id: string) => void;
    moveComponent: (id: string, newPosition: Position) => void;
    selectComponent: (id: string | null) => void;
    setDragging: (isDragging: boolean) => void;

    // Container actions
    wrapInContainer: (componentIds: string[], containerType: 'grid-container' | 'stack-container') => void;
    unwrapContainer: (containerId: string) => void;
    addToContainer: (containerId: string, component: ComponentInstance) => void;
    removeFromContainer: (containerId: string, childId: string) => void;
    reorderInContainer: (containerId: string, childId: string, newIndex: number) => void;
    updateContainerProps: (containerId: string, props: Partial<GridContainerProps | StackContainerProps>) => void;

    // Helper functions
    findParentContainer: (childId: string) => ComponentInstance | null;
    getChildIndex: (containerId: string, childId: string) => number;

    // Grid container specific actions
    findNextGridCell: (containerId: string) => GridPosition | null;
    validateGridPosition: (containerId: string, childId: string | null, position: GridPosition) => { valid: boolean; reason?: string };
    canRemoveGridColumn: (containerId: string, columnIndex: number) => { canRemove: boolean; reason?: string; affectedComponents?: string[] };
    addGridColumn: (containerId: string, width?: number) => void;
    removeGridColumn: (containerId: string, columnIndex: number) => void;
    updateGridColumnWidth: (containerId: string, columnIndex: number, width: number) => void;
    updateChildGridPosition: (containerId: string, childId: string, position: GridPosition) => void;

    // Variable actions
    addVariable: (variable: Variable) => void;
    updateVariable: (id: string, updates: Partial<Variable>) => void;
    removeVariable: (id: string) => void;

    // Grid actions
    setGridColumns: (columns: number) => void;
    setGridGap: (gap: number) => void;

    // Save/Load actions
    saveToLocalStorage: () => void;
    loadFromLocalStorage: () => void;
}

export const useTemplateStore = create<TemplateStore>()(
    immer((set, get) => ({
        // Initial state
        grid: {
            columns: 12,
            gap: 16,
        },
        components: [],
        variables: [],
        selectedComponentId: null,
        isDragging: false,

        // Component actions
        addComponent: (component) =>
            set((state) => {
                state.components.push(component);
            }),

        updateComponent: (id, updates) =>
            set((state) => {
                // Helper function to update component recursively
                const updateComponentRecursive = (components: ComponentInstance[]): boolean => {
                    for (let i = 0; i < components.length; i++) {
                        if (components[i].id === id) {
                            components[i] = { ...components[i], ...updates };
                            return true;
                        }
                        if (components[i].children) {
                            const found = updateComponentRecursive(components[i].children!);
                            if (found) return true;
                        }
                    }
                    return false;
                };

                updateComponentRecursive(state.components);
            }),

        removeComponent: (id) =>
            set((state) => {
                state.components = state.components.filter((c) => c.id !== id);
                if (state.selectedComponentId === id) {
                    state.selectedComponentId = null;
                }
            }),

        moveComponent: (id, newPosition) =>
            set((state) => {
                const index = state.components.findIndex((c) => c.id === id);
                if (index !== -1) {
                    state.components[index].position = newPosition;
                }
            }),

        selectComponent: (id) =>
            set((state) => {
                state.selectedComponentId = id;
            }),

        setDragging: (isDragging) =>
            set((state) => {
                state.isDragging = isDragging;
            }),

        // Variable actions
        addVariable: (variable) =>
            set((state) => {
                state.variables.push(variable);
            }),

        updateVariable: (id, updates) =>
            set((state) => {
                const index = state.variables.findIndex((v) => v.id === id);
                if (index !== -1) {
                    state.variables[index] = { ...state.variables[index], ...updates };
                }
            }),

        removeVariable: (id) =>
            set((state) => {
                state.variables = state.variables.filter((v) => v.id !== id);
            }),

        // Grid actions
        setGridColumns: (columns) =>
            set((state) => {
                state.grid.columns = columns;
            }),

        setGridGap: (gap) =>
            set((state) => {
                state.grid.gap = gap;
            }),

        // Container actions
        wrapInContainer: (componentIds, containerType) =>
            set((state) => {
                const componentsToWrap = state.components.filter((c) => componentIds.includes(c.id));
                if (componentsToWrap.length === 0) return;

                // Use the first component's position for the container
                const firstComponent = componentsToWrap[0];
                const containerPosition = firstComponent.position;

                // Create children with relative positions
                const children = componentsToWrap.map((comp, index) => ({
                    ...comp,
                    position: { type: 'relative' as const, index },
                }));

                // Create the container
                const container: ComponentInstance = {
                    id: `container-${Date.now()}`,
                    type: containerType,
                    position: containerPosition,
                    props: containerType === 'grid-container'
                        ? { ...defaultGridContainerProps, columns: Array(children.length).fill(1) }
                        : defaultStackContainerProps,
                    children,
                };

                // Remove wrapped components from top level
                state.components = state.components.filter((c) => !componentIds.includes(c.id));

                // Add the container
                state.components.push(container);
            }),

        unwrapContainer: (containerId) =>
            set((state) => {
                const containerIndex = state.components.findIndex((c) => c.id === containerId);
                if (containerIndex === -1) return;

                const container = state.components[containerIndex];
                if (!container.children) return;

                // Promote children to top level with absolute positions
                const containerPosition = container.position;
                const promotedChildren = container.children.map((child) => ({
                    ...child,
                    position: {
                        type: 'absolute' as const,
                        row: (containerPosition as any).row || 0,
                        column: (containerPosition as any).column || 0,
                        span: (containerPosition as any).span || 12,
                    },
                }));

                // Remove container and add children
                state.components.splice(containerIndex, 1);
                state.components.push(...promotedChildren);

                // Deselect if container was selected
                if (state.selectedComponentId === containerId) {
                    state.selectedComponentId = null;
                }
            }),

        addToContainer: (containerId, component) =>
            set((state) => {
                const container = state.components.find((c) => c.id === containerId);
                if (!container || !container.children) return;

                let newChild: ComponentInstance;

                if (container.type === 'grid-container') {
                    // Grid container: use GridPosition
                    const nextCell = get().findNextGridCell(containerId);

                    if (nextCell) {
                        // Empty cell available
                        newChild = {
                            ...component,
                            position: nextCell,
                        };
                    } else {
                        // Grid is full, add new column
                        const props = container.props as GridContainerProps;
                        props.columns.push(1);
                        newChild = {
                            ...component,
                            position: {
                                type: 'grid',
                                columnIndex: props.columns.length - 1,
                                span: 1
                            },
                        };
                    }
                } else {
                    // Stack container: use RelativePosition
                    newChild = {
                        ...component,
                        position: { type: 'relative' as const, index: container.children.length },
                    };
                }

                container.children.push(newChild);
            }),

        removeFromContainer: (containerId, childId) =>
            set((state) => {
                const container = state.components.find((c) => c.id === containerId);
                if (!container || !container.children) return;

                // Remove child
                container.children = container.children.filter((c) => c.id !== childId);

                // For stack containers, reindex remaining children
                if (container.type === 'stack-container') {
                    container.children.forEach((child, index) => {
                        if (hasRelativePosition(child.position)) {
                            child.position.index = index;
                        }
                    });
                }

                // For grid containers, no automatic reindexing needed
                // Children keep their grid positions

                // Deselect if child was selected
                if (state.selectedComponentId === childId) {
                    state.selectedComponentId = null;
                }
            }),

        reorderInContainer: (containerId, childId, newIndex) =>
            set((state) => {
                const container = state.components.find((c) => c.id === containerId);
                if (!container || !container.children) return;

                const childIndex = container.children.findIndex((c) => c.id === childId);
                if (childIndex === -1) return;

                // Move child to new index
                const [child] = container.children.splice(childIndex, 1);
                container.children.splice(newIndex, 0, child);

                // Reindex all children
                container.children.forEach((c, index) => {
                    c.position = { type: 'relative', index };
                });
            }),

        updateContainerProps: (containerId, props) =>
            set((state) => {
                const container = state.components.find((c) => c.id === containerId);
                if (!container) return;

                container.props = { ...container.props, ...props };
            }),

        // Helper functions
        findParentContainer: (childId: string): ComponentInstance | null => {
            const state = get();
            for (const component of state.components) {
                if (component.children) {
                    const hasChild = component.children.some((c: ComponentInstance) => c.id === childId);
                    if (hasChild) return component;
                }
            }
            return null;
        },

        getChildIndex: (containerId: string, childId: string): number => {
            const state = get();
            const container = state.components.find((c: ComponentInstance) => c.id === containerId);
            if (!container || !container.children) return -1;

            return container.children.findIndex((c: ComponentInstance) => c.id === childId);
        },

        // Grid container specific actions
        findNextGridCell: (containerId: string): GridPosition | null => {
            const state = get();
            const container = state.components.find(c => c.id === containerId);
            if (!container || container.type !== 'grid-container') return null;

            const props = container.props as GridContainerProps;
            const numColumns = props.columns.length;
            const children = container.children || [];

            // Calculate occupied cells (simplified: single-row logic)
            const occupiedCols = new Set<number>();
            children.forEach(child => {
                if (hasGridPosition(child.position)) {
                    for (let i = 0; i < child.position.span; i++) {
                        occupiedCols.add(child.position.columnIndex + i);
                    }
                }
            });

            // Find first empty cell
            for (let col = 0; col < numColumns; col++) {
                if (!occupiedCols.has(col)) {
                    return { type: 'grid', columnIndex: col, span: 1 };
                }
            }

            return null; // Grid is full
        },

        validateGridPosition: (containerId: string, childId: string | null, position: GridPosition) => {
            const state = get();
            const container = state.components.find(c => c.id === containerId);

            if (!container || container.type !== 'grid-container') {
                return { valid: false, reason: 'Container not found or not a grid' };
            }

            const props = container.props as GridContainerProps;
            const numColumns = props.columns.length;

            // Validate bounds
            if (position.columnIndex < 0 || position.columnIndex >= numColumns) {
                return { valid: false, reason: 'Column index out of bounds' };
            }

            if (position.span < 1) {
                return { valid: false, reason: 'Span must be at least 1' };
            }

            if (position.columnIndex + position.span > numColumns) {
                return { valid: false, reason: 'Span exceeds grid width' };
            }

            // Check for overlaps (simplified: single-row logic)
            const children = container.children || [];
            for (const child of children) {
                // Skip self when updating existing component
                if (childId && child.id === childId) continue;

                if (hasGridPosition(child.position)) {
                    const childStart = child.position.columnIndex;
                    const childEnd = childStart + child.position.span - 1;
                    const newStart = position.columnIndex;
                    const newEnd = newStart + position.span - 1;

                    // Check overlap
                    if (!(newEnd < childStart || newStart > childEnd)) {
                        return { valid: false, reason: 'Position overlaps with another component' };
                    }
                }
            }

            return { valid: true };
        },

        canRemoveGridColumn: (containerId: string, columnIndex: number) => {
            const state = get();
            const container = state.components.find(c => c.id === containerId);

            if (!container || container.type !== 'grid-container') {
                return { canRemove: false, reason: 'Container not found' };
            }

            const props = container.props as GridContainerProps;

            if (props.columns.length === 1) {
                return { canRemove: false, reason: 'Cannot remove the last column' };
            }

            const children = container.children || [];
            const affected = children.filter(child => {
                if (!hasGridPosition(child.position)) return false;
                const pos = child.position;
                return pos.columnIndex <= columnIndex &&
                    pos.columnIndex + pos.span > columnIndex;
            });

            if (affected.length > 0) {
                return {
                    canRemove: false,
                    reason: `${affected.length} component(s) occupy this column`,
                    affectedComponents: affected.map(c => c.id)
                };
            }

            return { canRemove: true };
        },

        addGridColumn: (containerId: string, width: number = 1) =>
            set((state) => {
                const container = state.components.find(c => c.id === containerId);
                if (!container || container.type !== 'grid-container') return;

                const props = container.props as GridContainerProps;
                props.columns.push(width);
            }),

        removeGridColumn: (containerId: string, columnIndex: number) =>
            set((state) => {
                const validation = get()
                    .canRemoveGridColumn(containerId, columnIndex);

                if (!validation.canRemove) {
                    console.warn('Cannot remove column:', validation.reason);
                    return;
                }

                const container = state.components.find(c => c.id === containerId);
                if (!container || container.type !== 'grid-container') return;

                const props = container.props as GridContainerProps;
                props.columns.splice(columnIndex, 1);

                // Shift children that are after the removed column
                container.children?.forEach(child => {
                    if (hasGridPosition(child.position) &&
                        child.position.columnIndex > columnIndex) {
                        child.position.columnIndex -= 1;
                    }
                });
            }),

        updateGridColumnWidth: (containerId: string, columnIndex: number, width: number) =>
            set((state) => {
                const container = state.components.find(c => c.id === containerId);
                if (!container || container.type !== 'grid-container') return;

                const props = container.props as GridContainerProps;
                if (columnIndex >= 0 && columnIndex < props.columns.length) {
                    props.columns[columnIndex] = width;
                }
            }),

        updateChildGridPosition: (containerId: string, childId: string, position: GridPosition) =>
            set((state) => {
                const container = state.components.find(c => c.id === containerId);
                if (!container || !container.children) return;

                const child = container.children.find(c => c.id === childId);
                if (!child) return;

                // Validate position
                const validation = get()
                    .validateGridPosition(containerId, childId, position);

                if (!validation.valid) {
                    console.warn('Invalid grid position:', validation.reason);
                    return;
                }

                child.position = position;
            }),

        // Save/Load actions
        saveToLocalStorage: () => {
            const state = get();
            const dataToSave = {
                grid: state.grid,
                components: state.components,
                variables: state.variables,
            };
            try {
                localStorage.setItem('pdf-template', JSON.stringify(dataToSave));
                console.log('Template saved to local storage');
            } catch (error) {
                console.error('Failed to save template:', error);
            }
        },

        loadFromLocalStorage: () => {
            try {
                const saved = localStorage.getItem('pdf-template');
                if (saved) {
                    const data = JSON.parse(saved);
                    set((state) => {
                        state.grid = data.grid || state.grid;
                        state.components = data.components || [];
                        state.variables = data.variables || [];
                    });
                    console.log('Template loaded from local storage');
                }
            } catch (error) {
                console.error('Failed to load template:', error);
            }
        },
    }))
);
