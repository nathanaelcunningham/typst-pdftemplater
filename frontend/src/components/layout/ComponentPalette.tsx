import { PaletteItem } from '../palette/PaletteItem';
import type { ComponentType } from '../../types/template';

export function ComponentPalette() {
    const contentComponents: { type: ComponentType; label: string; icon: string }[] = [
        { type: 'text', label: 'Text', icon: '📝' },
        { type: 'image', label: 'Image', icon: '🖼️' },
        { type: 'table', label: 'Table', icon: '📊' },
    ];

    const layoutComponents: { type: ComponentType; label: string; icon: string }[] = [
        { type: 'grid-container', label: 'Grid Container', icon: '▦' },
        { type: 'stack-container', label: 'Stack Container', icon: '☰' },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b-2 border-cream-dark bg-gradient-to-b from-cream/50 to-transparent">
                <h2 className="text-lg font-serif font-semibold text-charcoal tracking-tight">
                    Components
                </h2>
                <p className="text-xs text-slate-lighter mt-1">Drag to canvas to build</p>
            </div>
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
