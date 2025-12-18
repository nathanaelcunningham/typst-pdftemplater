import { DndContext, type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { ComponentPalette } from './ComponentPalette';
import { Canvas } from './Canvas';
import { PropertyEditor } from './PropertyEditor';
import { VariableManager } from './VariableManager';
import { PreviewPanel } from '../preview/PreviewPanel';
import { VariableValuesPanel } from '../preview/VariableValuesPanel';
import { CommandPalette } from '../ui/CommandPalette';
import { Button } from '../ui/Button';
import { Tab } from '../ui/Tab';
import { LoadingOverlay } from '../ui/LoadingOverlay';
import { ErrorOverlay } from '../ui/ErrorOverlay';
import { IconButton } from '../ui/IconButton';
import { useTemplateStore } from '../../store/templateStore';
import { generateTypst } from '../../generators/typstGenerator';
import { getTemplate } from '../../api';
import { handleDragEnd as handleDragEndUtil } from '../../utils/dragAndDropHandlers';

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
        handleDragEndUtil(event, components, {
            addComponent,
            addToContainer,
            addGridColumn,
            setDragging,
        });
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
                {isLoading && <LoadingOverlay message="Loading template..." />}

                {/* Error Overlay */}
                {loadError && (
                    <ErrorOverlay
                        title="Error Loading Template"
                        message={loadError}
                        buttonText="Back to Templates"
                        onButtonClick={() => window.location.href = '/templates'}
                    />
                )}

                {/* Top Bar - Editorial Header */}
                <div className="h-16 bg-charcoal border-b-2 border-amber flex items-center px-8 shadow-lg">
                    {/* Menu Button */}
                    <IconButton
                        onClick={() => setShowCommandPalette(true)}
                        title="Open menu (Cmd+K)"
                        icon={<Menu className="w-5 h-5 text-cream" />}
                        label="Templateer"
                    />

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

                        <Button
                            onClick={() => setShowVariables(true)}
                            variant="secondary"
                            className="text-cream bg-slate border border-slate-light hover:bg-slate-light"
                        >
                            Variables
                        </Button>
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
                            <Tab
                                onClick={() => setActiveTab('editor')}
                                active={activeTab === 'editor'}
                            >
                                Editor
                            </Tab>
                            <Tab
                                onClick={() => setActiveTab('code')}
                                active={activeTab === 'code'}
                                mono
                            >
                                Typst Code
                            </Tab>
                            <Tab
                                onClick={() => setActiveTab('preview')}
                                active={activeTab === 'preview'}
                            >
                                Preview
                            </Tab>

                            {/* Copy button - only show in Code tab */}
                            {activeTab === 'code' && (
                                <Button
                                    onClick={handleCopy}
                                    size="sm"
                                    variant="secondary"
                                    className="ml-auto mr-4 bg-amber/20 hover:bg-amber/30 border border-amber/30 hover:border-amber text-ink"
                                >
                                    Copy Code
                                </Button>
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
