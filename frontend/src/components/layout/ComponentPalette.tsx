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
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Components
                </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                    {/* Content Components */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
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
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
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
