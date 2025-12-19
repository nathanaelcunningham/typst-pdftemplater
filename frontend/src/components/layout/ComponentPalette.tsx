import { PaletteItem } from '../palette/PaletteItem';
import type { ComponentType } from '../../types/template';
import { SectionHeader } from '../ui';

export function ComponentPalette() {
    const contentComponents: { type: ComponentType; label: string; icon: string }[] = [
        { type: 'text', label: 'Text', icon: '📝' },
        { type: 'image', label: 'Image', icon: '🖼️' },
        { type: 'table', label: 'Table', icon: '📊' },
        { type: 'page-break', label: 'Page Break', icon: '📄' },
        { type: 'heading', label: 'Heading', icon: '📄' },
        { type: 'spacer', label: 'Spacer', icon: '📄' },
    ];

    const layoutComponents: { type: ComponentType; label: string; icon: string }[] = [
        { type: 'grid-container', label: 'Grid Container', icon: '▦' },
        { type: 'stack-container', label: 'Stack Container', icon: '☰' },
    ];

    return (
        <div className="flex flex-col h-full">
            <SectionHeader
                title="Components"
                description="Drag to canvas to build"
            />
            <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-6">
                    {/* Content Components */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-light uppercase tracking-widest mb-3 px-1">
                            Content
                        </h3>
                        <div className="space-y-2">
                            {contentComponents.map((component) => (
                                <PaletteItem
                                    key={component.type}
                                    type={component.type}
                                    label={component.label}
                                    icon={component.icon}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Layout Components */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-light uppercase tracking-widest mb-3 px-1">
                            Layout
                        </h3>
                        <div className="space-y-2">
                            {layoutComponents.map((component) => (
                                <PaletteItem
                                    key={component.type}
                                    type={component.type}
                                    label={component.label}
                                    icon={component.icon}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
