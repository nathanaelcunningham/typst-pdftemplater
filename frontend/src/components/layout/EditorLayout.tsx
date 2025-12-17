import { DndContext, type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ComponentPalette } from './ComponentPalette';
import { Canvas } from './Canvas';
import { PropertyEditor } from './PropertyEditor';
import { VariableManager } from './VariableManager';
import { PreviewPanel } from '../preview/PreviewPanel';
import { VariableValuesPanel } from '../preview/VariableValuesPanel';
import { CommandPalette } from '../ui/CommandPalette';
import { useTemplateStore } from '../../store/templateStore';
import { generateTypst } from '../../generators/typstGenerator';
import { getTemplate } from '../../api';
import type { ComponentType } from '../../types/template';
import { hasAbsolutePosition } from '../../types/template';
import { defaultTextProps, defaultImageProps, defaultTableProps, defaultGridContainerProps, defaultStackContainerProps } from '../../types/components';

type CenterTab = 'editor' | 'code' | 'preview';

export function EditorLayout() {
    const { templateId } = useParams<{ templateId: string }>();
    const [showVariables, setShowVariables] = useState(false);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [activeTab, setActiveTab] = useState<CenterTab>('editor');
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const {
        addComponent,
        setDragging,
        selectedComponentId,
        removeComponent,
        selectComponent,
        components,
        variables,
        grid,
        addToContainer,
        addGridColumn,
        clearPreview,
        currentTemplateName,
        hasUnsavedChanges,
        createBlankTemplate,
        loadTemplateData,
    } = useTemplateStore();

    // Generate Typst code (memoized for performance)
    const typstCode = useMemo(() => {
        return generateTypst({ components, grid });
    }, [components, variables, grid]);

    const handleCopy = () => {
        navigator.clipboard.writeText(typstCode);
    };

    // Cleanup preview on unmount
    useEffect(() => {
        return () => {
            clearPreview();
        };
    }, [clearPreview]);

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

    // Load template from URL or initialize blank template
    useEffect(() => {
        const loadTemplate = async () => {
            if (templateId) {
                // Load existing template from URL
                setIsLoading(true);
                setLoadError(null);
                try {
                    const template = await getTemplate(templateId);
                    loadTemplateData(template);
                } catch (err) {
                    console.error('Failed to load template:', err);
                    setLoadError('Failed to load template. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            } else {
                // Create blank template for new template
                createBlankTemplate();
            }
        };

        loadTemplate();
    }, [templateId, createBlankTemplate, loadTemplateData]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Don't handle shortcuts if user is typing in an input/textarea (except Cmd+K)
            const target = event.target as HTMLElement;
            const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

            // Open command palette on Cmd+K / Ctrl+K
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                setShowCommandPalette(true);
                return;
            }

            if (isTyping) return;

            // Delete selected component on Delete or Backspace
            if ((event.key === 'Delete' || event.key === 'Backspace') && selectedComponentId) {
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
            <div className="flex flex-col h-screen bg-cream font-sans">
                {/* Loading Overlay */}
                {isLoading && (
                    <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-paper border-2 border-cream-dark rounded-lg p-8 shadow-2xl">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-amber border-t-transparent rounded-full animate-spin" />
                                <p className="text-lg font-medium text-ink">Loading template...</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Overlay */}
                {loadError && (
                    <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-paper border-2 border-red-300 rounded-lg p-8 shadow-2xl max-w-md">
                            <div className="flex flex-col items-center gap-4">
                                <div className="text-4xl">⚠️</div>
                                <h2 className="text-xl font-serif font-semibold text-ink">Error Loading Template</h2>
                                <p className="text-slate-lighter text-center">{loadError}</p>
                                <button
                                    onClick={() => window.location.href = '/templates'}
                                    className="px-6 py-3 text-sm font-medium text-charcoal bg-amber rounded-md hover:bg-amber-dark active:scale-95 transition-all shadow-md"
                                >
                                    Back to Templates
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Bar - Editorial Header */}
                <div className="h-16 bg-charcoal border-b-2 border-amber flex items-center px-8 shadow-lg">
                    {/* Menu Button */}
                    <button
                        onClick={() => setShowCommandPalette(true)}
                        className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-slate/20 transition-colors group"
                        title="Open menu (Cmd+K)"
                    >
                        <svg className="w-5 h-5 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span className="text-xl font-serif font-semibold text-cream tracking-tight">
                            Templateer
                        </span>
                    </button>

                    {/* Template Name */}
                    <div className="ml-6 flex items-center gap-2 text-cream/70">
                        <span className="text-sm">Template:</span>
                        <span className="text-sm font-medium text-cream">{currentTemplateName}</span>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        {/* Unsaved Changes Indicator */}
                        {hasUnsavedChanges && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber/20 border border-amber/40 rounded-md">
                                <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
                                <span className="text-xs font-medium text-amber">Unsaved</span>
                            </div>
                        )}

                        <button
                            onClick={() => setShowVariables(true)}
                            className="px-5 py-2.5 text-sm font-medium text-cream bg-slate border border-slate-light rounded-md hover:bg-slate-light active:scale-95 transition-all"
                        >
                            Variables
                        </button>
                    </div>
                </div>

                {/* Variable Manager Modal */}
                <VariableManager isOpen={showVariables} onClose={() => setShowVariables(false)} />

                {/* Command Palette */}
                <CommandPalette
                    isOpen={showCommandPalette}
                    onClose={() => setShowCommandPalette(false)}
                    onOpenVariables={() => setShowVariables(true)}
                />

                {/* Main Content Area */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar - Component Palette */}
                    <div className="w-72 bg-paper border-r-2 border-cream-dark flex flex-col shadow-sm">
                        <ComponentPalette />
                    </div>

                    {/* Center - Tabbed Interface */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-paper">
                        {/* Tab Bar - Refined Editorial Style */}
                        <div className="flex items-center border-b-2 border-cream-dark bg-paper">
                            <button
                                onClick={() => setActiveTab('editor')}
                                className={`px-6 py-3.5 text-sm font-medium transition-all border-b-2 ${activeTab === 'editor'
                                    ? 'text-amber-dark border-amber bg-cream/30'
                                    : 'text-slate-lighter border-transparent hover:text-ink hover:bg-cream/50'
                                    }`}
                            >
                                Editor
                            </button>
                            <button
                                onClick={() => setActiveTab('code')}
                                className={`px-6 py-3.5 text-sm font-mono font-medium transition-all border-b-2 ${activeTab === 'code'
                                    ? 'text-amber-dark border-amber bg-cream/30'
                                    : 'text-slate-lighter border-transparent hover:text-ink hover:bg-cream/50'
                                    }`}
                            >
                                Typst Code
                            </button>
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`px-6 py-3.5 text-sm font-medium transition-all border-b-2 ${activeTab === 'preview'
                                    ? 'text-amber-dark border-amber bg-cream/30'
                                    : 'text-slate-lighter border-transparent hover:text-ink hover:bg-cream/50'
                                    }`}
                            >
                                Preview
                            </button>

                            {/* Copy button - only show in Code tab */}
                            {activeTab === 'code' && (
                                <button
                                    onClick={handleCopy}
                                    className="ml-auto mr-4 px-4 py-2 text-xs font-medium text-ink bg-amber/20 rounded hover:bg-amber/30 border border-amber/30 hover:border-amber active:scale-95 transition-all"
                                >
                                    Copy Code
                                </button>
                            )}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-hidden">
                            {activeTab === 'editor' ? (
                                <div className="h-full overflow-auto p-8 bg-cream">
                                    <Canvas />
                                </div>
                            ) : activeTab === 'code' ? (
                                <div className="h-full overflow-auto p-6 bg-ink/5">
                                    <pre className="text-xs font-mono text-slate-light whitespace-pre-wrap leading-relaxed p-4 bg-paper rounded-lg border border-cream-dark shadow-sm">
                                        {typstCode}
                                    </pre>
                                </div>
                            ) : (
                                <PreviewPanel />
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Property Editor or Variable Values */}
                    <div className="w-80 bg-paper border-l-2 border-cream-dark flex flex-col shadow-sm">
                        {activeTab === 'preview' ? (
                            <VariableValuesPanel />
                        ) : (
                            <PropertyEditor />
                        )}
                    </div>
                </div>
            </div>
        </DndContext>
    );
}
