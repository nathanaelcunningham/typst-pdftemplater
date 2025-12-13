import { DndContext, type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState, useEffect } from 'react';
import { ComponentPalette } from './ComponentPalette';
import { Canvas } from './Canvas';
import { PropertyEditor } from './PropertyEditor';
import { CodePreview } from './CodePreview';
import { VariableManager } from './VariableManager';
import { useTemplateStore } from '../../store/templateStore';
import type { ComponentType } from '../../types/template';
import { hasAbsolutePosition } from '../../types/template';
import { defaultTextProps, defaultImageProps, defaultTableProps, defaultGridContainerProps, defaultStackContainerProps } from '../../types/components';

export function EditorLayout() {
    const [showVariables, setShowVariables] = useState(false);
    const {
        addComponent,
        setDragging,
        selectedComponentId,
        removeComponent,
        selectComponent,
        components,
        addToContainer,
        addGridColumn,
    } = useTemplateStore();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (_event: DragStartEvent) => {
        setDragging(true);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setDragging(false);

        if (!over || !over.data.current) return;

        // Only handle palette items for now
        if (active.data.current?.type !== 'palette-item') return;

        const componentType = active.data.current.componentType as ComponentType;
        const dropType = over.data.current.type;

        // Get default props for the component
        let defaultProps: Record<string, any> = {};
        switch (componentType) {
            case 'text':
                defaultProps = defaultTextProps;
                break;
            case 'image':
                defaultProps = defaultImageProps;
                break;
            case 'table':
                defaultProps = defaultTableProps;
                break;
            case 'grid-container':
                defaultProps = defaultGridContainerProps;
                break;
            case 'stack-container':
                defaultProps = defaultStackContainerProps;
                break;
            default:
                defaultProps = {};
        }

        // Handle different drop zone types
        switch (dropType) {
            case 'canvas-empty':
            case 'canvas-new-row': {
                // Drop on empty canvas or new row - use provided position
                const dropPosition = over.data.current.position;
                const newComponent: any = {
                    id: `component-${Date.now()}`,
                    type: componentType,
                    position: dropPosition,
                    props: defaultProps,
                };

                // Initialize children array for containers
                if (componentType === 'grid-container' || componentType === 'stack-container') {
                    newComponent.children = [];
                }

                addComponent(newComponent);
                break;
            }

            case 'component-above':
            case 'component-below': {
                // Insert above or below existing component
                const targetId = over.data.current.targetComponentId;
                const targetComponent = components.find(c => c.id === targetId);

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
                    const newComponent: any = {
                        id: `component-${Date.now()}`,
                        type: componentType,
                        position: {
                            type: 'absolute',
                            row: newRow,
                            column: 0,
                            span: 12,
                        },
                        props: defaultProps,
                    };

                    // Initialize children array for containers
                    if (componentType === 'grid-container' || componentType === 'stack-container') {
                        newComponent.children = [];
                    }

                    addComponent(newComponent);
                }
                break;
            }

            case 'component-left':
            case 'component-right': {
                // Auto-wrap in grid container
                const targetId = over.data.current.targetComponentId;
                const targetComponent = components.find(c => c.id === targetId);

                if (targetComponent && hasAbsolutePosition(targetComponent.position)) {
                    // Create the new component first
                    const newComponent = {
                        id: `component-${Date.now()}`,
                        type: componentType,
                        position: {
                            type: 'relative' as const,
                            index: dropType === 'component-left' ? 0 : 1,
                        },
                        props: defaultProps,
                    };

                    // Check if target is already in a grid container
                    const parentContainer = components.find(c =>
                        c.type === 'grid-container' &&
                        c.children?.some(child => child.id === targetId)
                    );

                    if (parentContainer && parentContainer.children) {
                        // Add to existing container
                        const targetIndex = parentContainer.children.findIndex(child => child.id === targetId);
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

                        const container = {
                            id: `container-${Date.now()}`,
                            type: 'grid-container' as const,
                            position: targetComponent.position,
                            props: { ...defaultGridContainerProps, columns: [1, 1] },
                            children: dropType === 'component-left'
                                ? [newComponent, targetWithRelativePos]
                                : [targetWithRelativePos, newComponent],
                        };

                        // Remove target from top level
                        const targetIndex = components.findIndex(c => c.id === targetId);
                        if (targetIndex !== -1) {
                            components.splice(targetIndex, 1);
                        }

                        // Add container
                        addComponent(container);
                    }
                }
                break;
            }

            case 'container-interior': {
                // Drop inside a container
                const containerId = over.data.current.targetComponentId;
                const container = components.find(c => c.id === containerId);

                if (container && (container.type === 'grid-container' || container.type === 'stack-container')) {
                    const newComponent = {
                        id: `component-${Date.now()}`,
                        type: componentType,
                        position: {
                            type: 'relative' as const,
                            index: container.children?.length || 0,
                        },
                        props: defaultProps,
                    };

                    // Use the store action to add to container
                    addToContainer(containerId, newComponent);
                }
                break;
            }

            case 'grid-cell': {
                // Drop into specific grid cell
                const containerId = over.data.current.targetComponentId;
                const cellIndex = over.data.current.gridCellIndex;

                const newComponent: any = {
                    id: `component-${Date.now()}`,
                    type: componentType,
                    position: {
                        type: 'grid',
                        columnIndex: cellIndex,
                        span: 1
                    },
                    props: defaultProps,
                };

                // Initialize children array for containers
                if (componentType === 'grid-container' || componentType === 'stack-container') {
                    newComponent.children = [];
                }

                addToContainer(containerId, newComponent);
                break;
            }

            case 'grid-overflow': {
                // Grid is full, add new column
                const containerId = over.data.current.targetComponentId;
                const container = components.find(c => c.id === containerId);

                if (container && container.type === 'grid-container') {
                    // Add new column first
                    addGridColumn(containerId, 1);

                    // Get updated column count
                    const props = container.props as any;
                    const newColumnIndex = props.columns.length - 1;

                    const newComponent: any = {
                        id: `component-${Date.now()}`,
                        type: componentType,
                        position: {
                            type: 'grid',
                            columnIndex: newColumnIndex,
                            span: 1
                        },
                        props: defaultProps,
                    };

                    // Initialize children array for containers
                    if (componentType === 'grid-container' || componentType === 'stack-container') {
                        newComponent.children = [];
                    }

                    addToContainer(containerId, newComponent);
                }
                break;
            }
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Delete selected component on Delete or Backspace
            if ((event.key === 'Delete' || event.key === 'Backspace') && selectedComponentId) {
                // Don't delete if user is typing in an input/textarea
                const target = event.target as HTMLElement;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                    return;
                }
                event.preventDefault();
                removeComponent(selectedComponentId);
            }

            // Deselect on Escape
            if (event.key === 'Escape' && selectedComponentId) {
                selectComponent(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedComponentId, removeComponent, selectComponent]);

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-screen bg-gray-100">
                {/* Top Bar */}
                <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 shadow-sm">
                    <h1 className="text-xl font-semibold text-gray-800">PDF Template Builder</h1>
                    <div className="ml-auto flex gap-2">
                        <button
                            onClick={() => setShowVariables(true)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Variables
                        </button>
                    </div>
                </div>

                {/* Variable Manager Modal */}
                <VariableManager isOpen={showVariables} onClose={() => setShowVariables(false)} />

                {/* Main Content Area */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar - Component Palette */}
                    <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
                        <ComponentPalette />
                    </div>

                    {/* Center - Canvas */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-auto p-6">
                            <Canvas />
                        </div>

                        {/* Bottom Panel - Code Preview */}
                        <div className="h-56 bg-white border-t border-gray-200 shadow-lg">
                            <CodePreview />
                        </div>
                    </div>

                    {/* Right Sidebar - Property Editor */}
                    <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-sm">
                        <PropertyEditor />
                    </div>
                </div>
            </div>
        </DndContext>
    );
}
