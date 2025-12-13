import { useTemplateStore } from '../../store/templateStore';
import { TextProperties } from './TextProperties';
import { ImageProperties } from './ImageProperties';
import { TableProperties } from './TableProperties';

export function PropertyPanel() {
  const selectedComponentId = useTemplateStore((state) => state.selectedComponentId);
  const components = useTemplateStore((state) => state.components);
  const removeComponent = useTemplateStore((state) => state.removeComponent);

  const selectedComponent = components.find((c) => c.id === selectedComponentId);

  if (!selectedComponent) {
    return (
      <div className="text-sm text-gray-400 text-center py-12">
        <p>Select a component to edit its properties</p>
      </div>
    );
  }

  const handleDelete = () => {
    if (selectedComponent) {
      removeComponent(selectedComponent.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Component type indicator */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-700 capitalize">
          {selectedComponent.type} Component
        </div>
        <button
          onClick={handleDelete}
          className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
        >
          Delete
        </button>
      </div>

      {/* Component-specific properties */}
      {selectedComponent.type === 'text' && <TextProperties component={selectedComponent} />}
      {selectedComponent.type === 'image' && <ImageProperties component={selectedComponent} />}
      {selectedComponent.type === 'table' && <TableProperties component={selectedComponent} />}
    </div>
  );
}
