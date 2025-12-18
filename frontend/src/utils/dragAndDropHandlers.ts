import type { DragEndEvent } from '@dnd-kit/core';
import type { ComponentType, ComponentInstance } from '../types/template';
import { hasAbsolutePosition } from '../types/template';
import {
    defaultTextProps,
    defaultImageProps,
    defaultTableProps,
    defaultGridContainerProps,
    defaultStackContainerProps,
    defaultPageBreakProps,
} from '../types/components';

/**
 * Get default props for a component type
 */
export function getDefaultPropsForComponent(componentType: ComponentType): Record<string, any> {
    switch (componentType) {
        case 'text':
            return defaultTextProps;
        case 'image':
            return defaultImageProps;
        case 'table':
            return defaultTableProps;
        case 'grid-container':
            return defaultGridContainerProps;
        case 'stack-container':
            return defaultStackContainerProps;
        case 'page-break':
            return defaultPageBreakProps;
        default:
            return {};
    }
}

/**
 * Create a new component with the given type, position, and props
 * Automatically initializes children array for containers
 */
export function createNewComponent(
    componentType: ComponentType,
    position: any,
    props?: Record<string, any>
): ComponentInstance {
    const defaultProps = props ?? getDefaultPropsForComponent(componentType);

    const newComponent: ComponentInstance = {
        id: `component-${Date.now()}`,
        type: componentType,
        position,
        props: defaultProps,
    };

    // Initialize children array for containers
    if (componentType === 'grid-container' || componentType === 'stack-container') {
        newComponent.children = [];
    }

    return newComponent;
}

/**
 * Handle drop on empty canvas or new row
 */
export function handleCanvasDrop(
    componentType: ComponentType,
    dropPosition: any,
    addComponent: (component: ComponentInstance) => void
) {
    const newComponent = createNewComponent(componentType, dropPosition);
    addComponent(newComponent);
}

/**
 * Handle drop above or below existing component
 */
export function handleComponentAboveBelowDrop(
    componentType: ComponentType,
    dropType: 'component-above' | 'component-below',
    targetComponentId: string,
    components: ComponentInstance[],
    addComponent: (component: ComponentInstance) => void
) {
    const targetComponent = components.find(c => c.id === targetComponentId);

    if (targetComponent && hasAbsolutePosition(targetComponent.position)) {
        const targetRow = targetComponent.position.row;
        const newRow = dropType === 'component-above' ? targetRow : targetRow + 1;

        // Shift down all components at or below the new row
        components.forEach(comp => {
            if (hasAbsolutePosition(comp.position) && comp.position.row >= newRow) {
                comp.position.row += 1;
            }
        });

        // Add new component at the target row
        const newComponent = createNewComponent(componentType, {
            type: 'absolute',
            row: newRow,
            column: 0,
            span: 12,
        });

        addComponent(newComponent);
    }
}

/**
 * Handle drop left or right of component (auto-wrap in grid container)
 */
export function handleComponentLeftRightDrop(
    componentType: ComponentType,
    dropType: 'component-left' | 'component-right',
    targetComponentId: string,
    components: ComponentInstance[],
    addComponent: (component: ComponentInstance) => void
) {
    const targetComponent = components.find(c => c.id === targetComponentId);

    if (targetComponent && hasAbsolutePosition(targetComponent.position)) {
        // Create the new component first
        const newComponent = createNewComponent(componentType, {
            type: 'relative' as const,
            index: dropType === 'component-left' ? 0 : 1,
        });

        // Check if target is already in a grid container
        const parentContainer = components.find(c =>
            c.type === 'grid-container' &&
            c.children?.some(child => child.id === targetComponentId)
        );

        if (parentContainer && parentContainer.children) {
            // Add to existing container
            const targetIndex = parentContainer.children.findIndex(child => child.id === targetComponentId);
            const insertIndex = dropType === 'component-left' ? targetIndex : targetIndex + 1;

            parentContainer.children.splice(insertIndex, 0, newComponent);

            // Update column fractions
            const childCount = parentContainer.children.length;
            parentContainer.props = {
                ...parentContainer.props,
                columns: Array(childCount).fill(1),
            };
        } else {
            // Create new grid container wrapping both
            const targetWithRelativePos = {
                ...targetComponent,
                position: {
                    type: 'relative' as const,
                    index: dropType === 'component-left' ? 1 : 0,
                },
            };

            const container: ComponentInstance = {
                id: `container-${Date.now()}`,
                type: 'grid-container' as const,
                position: targetComponent.position,
                props: { ...defaultGridContainerProps, columns: [1, 1] },
                children: dropType === 'component-left'
                    ? [newComponent, targetWithRelativePos]
                    : [targetWithRelativePos, newComponent],
            };

            // Remove target from top level
            const targetIndex = components.findIndex(c => c.id === targetComponentId);
            if (targetIndex !== -1) {
                components.splice(targetIndex, 1);
            }

            // Add container
            addComponent(container);
        }
    }
}

/**
 * Handle drop inside a container
 */
export function handleContainerInteriorDrop(
    componentType: ComponentType,
    containerId: string,
    components: ComponentInstance[],
    addToContainer: (containerId: string, component: ComponentInstance) => void
) {
    const container = components.find(c => c.id === containerId);

    if (container && (container.type === 'grid-container' || container.type === 'stack-container')) {
        const newComponent = createNewComponent(componentType, {
            type: 'relative' as const,
            index: container.children?.length || 0,
        });

        // Use the store action to add to container
        addToContainer(containerId, newComponent);
    }
}

/**
 * Handle drop into specific grid cell
 */
export function handleGridCellDrop(
    componentType: ComponentType,
    containerId: string,
    cellIndex: number,
    addToContainer: (containerId: string, component: ComponentInstance) => void
) {
    const newComponent = createNewComponent(componentType, {
        type: 'grid',
        columnIndex: cellIndex,
        span: 1
    });

    addToContainer(containerId, newComponent);
}

/**
 * Handle drop on grid overflow (adds new column)
 */
export function handleGridOverflowDrop(
    componentType: ComponentType,
    containerId: string,
    components: ComponentInstance[],
    addGridColumn: (containerId: string, fraction: number) => void,
    addToContainer: (containerId: string, component: ComponentInstance) => void
) {
    const container = components.find(c => c.id === containerId);

    if (container && container.type === 'grid-container') {
        // Add new column first
        addGridColumn(containerId, 1);

        // Get updated column count
        const props = container.props as any;
        const newColumnIndex = props.columns.length - 1;

        const newComponent = createNewComponent(componentType, {
            type: 'grid',
            columnIndex: newColumnIndex,
            span: 1
        });

        addToContainer(containerId, newComponent);
    }
}

/**
 * Main drag end handler - routes to appropriate handler based on drop type
 */
export function handleDragEnd(
    event: DragEndEvent,
    components: ComponentInstance[],
    storeActions: {
        addComponent: (component: ComponentInstance) => void;
        addToContainer: (containerId: string, component: ComponentInstance) => void;
        addGridColumn: (containerId: string, fraction: number) => void;
        setDragging: (dragging: boolean) => void;
    }
) {
    const { active, over } = event;
    const { addComponent, addToContainer, addGridColumn, setDragging } = storeActions;

    setDragging(false);

    if (!over || !over.data.current) return;

    // Only handle palette items for now
    if (active.data.current?.type !== 'palette-item') return;

    const componentType = active.data.current.componentType as ComponentType;
    const dropType = over.data.current.type;

    // Route to appropriate handler based on drop type
    switch (dropType) {
        case 'canvas-empty':
        case 'canvas-new-row': {
            const dropPosition = over.data.current.position;
            handleCanvasDrop(componentType, dropPosition, addComponent);
            break;
        }

        case 'component-above':
        case 'component-below': {
            const targetId = over.data.current.targetComponentId;
            handleComponentAboveBelowDrop(
                componentType,
                dropType,
                targetId,
                components,
                addComponent
            );
            break;
        }

        case 'component-left':
        case 'component-right': {
            const targetId = over.data.current.targetComponentId;
            handleComponentLeftRightDrop(
                componentType,
                dropType,
                targetId,
                components,
                addComponent
            );
            break;
        }

        case 'container-interior': {
            const containerId = over.data.current.targetComponentId;
            handleContainerInteriorDrop(
                componentType,
                containerId,
                components,
                addToContainer
            );
            break;
        }

        case 'grid-cell': {
            const containerId = over.data.current.targetComponentId;
            const cellIndex = over.data.current.gridCellIndex;
            handleGridCellDrop(componentType, containerId, cellIndex, addToContainer);
            break;
        }

        case 'grid-overflow': {
            const containerId = over.data.current.targetComponentId;
            handleGridOverflowDrop(
                componentType,
                containerId,
                components,
                addGridColumn,
                addToContainer
            );
            break;
        }
    }
}
