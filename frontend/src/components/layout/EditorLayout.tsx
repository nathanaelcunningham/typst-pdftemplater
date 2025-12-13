import { DndContext, type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState, useEffect } from 'react';
import { ComponentPalette } from './ComponentPalette';
import { Canvas } from './Canvas';
import { PropertyEditor } from './PropertyEditor';
import { CodePreview } from './CodePreview';
import { VariableManager } from './VariableManager';
import { useTemplateStore } from '../../store/templateStore';
import type { ComponentType } from '../../types/template';
import { defaultTextProps, defaultImageProps, defaultTableProps } from '../../types/components';

export function EditorLayout() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showVariables, setShowVariables] = useState(false);
    const { addComponent, setDragging, selectedComponentId, removeComponent, selectComponent } = useTemplateStore();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
        setDragging(true);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        setDragging(false);

        if (!over) return;

        // Check if dropping a palette item onto the canvas
        if (active.data.current?.type === 'palette-item' && over.data.current?.type === 'canvas-drop-zone') {
            const componentType = active.data.current.componentType as ComponentType;
            const dropPosition = over.data.current.position;

            // Create default props based on component type
            let defaultProps;
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
            }

            // Add component to store
            addComponent({
                id: `component-${Date.now()}`,
                type: componentType,
                position: dropPosition,
                props: defaultProps,
            });
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
