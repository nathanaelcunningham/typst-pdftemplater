import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplateStore } from '../../store/templateStore';
import { createTemplate, updateTemplate } from '../../api';

interface Command {
    id: string;
    label: string;
    icon: string;
    shortcut?: string;
    action: () => void | Promise<void>;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenVariables: () => void;
}

export function CommandPalette({ isOpen, onClose, onOpenVariables }: CommandPaletteProps) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        createBlankTemplate,
        currentTemplateId,
        currentTemplateName,
        currentTemplateDescription,
        hasUnsavedChanges,
        grid,
        components,
        variables,
        markSaved,
        updateTemplateName,
    } = useTemplateStore();

    const handleNewTemplate = () => {
        if (hasUnsavedChanges) {
            const confirmed = confirm('You have unsaved changes. Create new template anyway?');
            if (!confirmed) return;
        }
        createBlankTemplate();
        navigate('/');
        onClose();
    };

    const handleSearchTemplates = () => {
        navigate('/templates');
        onClose();
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const content = { grid, components, variables };

            if (currentTemplateId) {
                // Update existing template
                await updateTemplate(currentTemplateId, {
                    name: currentTemplateName,
                    description: currentTemplateDescription,
                    content,
                });
            } else {
                // Create new template
                const newTemplate = await createTemplate({
                    name: currentTemplateName,
                    description: currentTemplateDescription,
                    content,
                });
                // Update store with the new template ID
                useTemplateStore.getState().loadTemplateData(newTemplate);
            }

            markSaved();
            onClose();
        } catch (error) {
            console.error('Failed to save template:', error);
            alert('Failed to save template. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRename = () => {
        const newName = prompt('Enter new template name:', currentTemplateName);
        if (newName && newName.trim() !== '') {
            updateTemplateName(newName.trim());
        }
        onClose();
    };

    const commands: Command[] = [
        {
            id: 'new',
            label: 'New Template',
            icon: '📄',
            action: handleNewTemplate,
        },
        {
            id: 'search',
            label: 'Search Templates',
            icon: '🔍',
            shortcut: 'Cmd+P',
            action: handleSearchTemplates,
        },
        {
            id: 'save',
            label: isSaving ? 'Saving...' : (hasUnsavedChanges ? 'Save' : 'Saved'),
            icon: '💾',
            shortcut: 'Cmd+S',
            action: handleSave,
        },
        {
            id: 'rename',
            label: 'Rename Template',
            icon: '✏️',
            action: handleRename,
        },
        {
            id: 'variables',
            label: 'Variables',
            icon: '🔗',
            action: () => {
                onOpenVariables();
                onClose();
            },
        },
    ];

    const filteredCommands = commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Reset selected index when search changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [searchQuery]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setSearchQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const selectedCommand = filteredCommands[selectedIndex];
                if (selectedCommand) {
                    selectedCommand.action();
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredCommands, selectedIndex, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={onClose}
            />

            {/* Command Palette */}
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50">
                <div className="bg-paper border-2 border-amber rounded-lg shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="p-4 border-b border-cream-dark">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Type to search commands..."
                            className="w-full px-4 py-3 bg-cream text-ink placeholder-slate-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-amber"
                        />
                    </div>

                    {/* Commands List */}
                    <div className="max-h-96 overflow-y-auto">
                        {filteredCommands.length === 0 ? (
                            <div className="p-8 text-center text-slate-lighter">
                                No commands found
                            </div>
                        ) : (
                            filteredCommands.map((command, index) => (
                                <button
                                    key={command.id}
                                    onClick={() => command.action()}
                                    disabled={command.id === 'save' && isSaving}
                                    className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${index === selectedIndex
                                            ? 'bg-amber/20 border-l-4 border-amber'
                                            : 'hover:bg-cream/50 border-l-4 border-transparent'
                                        } ${command.id === 'save' && isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{command.icon}</span>
                                        <span className="text-base font-medium text-ink">
                                            {command.label}
                                        </span>
                                    </div>
                                    {command.shortcut && (
                                        <span className="text-sm text-slate-lighter font-mono">
                                            {command.shortcut}
                                        </span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer Hint */}
                    <div className="px-6 py-3 bg-cream/30 border-t border-cream-dark text-xs text-slate-lighter flex items-center justify-between">
                        <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
                        <span className="font-mono">Cmd+K</span>
                    </div>
                </div>
            </div>
        </>
    );
}
