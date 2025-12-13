import { PaletteItem } from '../palette/PaletteItem';
import type { ComponentType } from '../../types/template';

export function ComponentPalette() {
    const components: { type: ComponentType; label: string; icon: string }[] = [
        { type: 'text', label: 'Text', icon: '📝' },
        { type: 'image', label: 'Image', icon: '🖼️' },
        { type: 'table', label: 'Table', icon: '📊' },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Components
                </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                    {components.map((component) => (
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
    );
}
