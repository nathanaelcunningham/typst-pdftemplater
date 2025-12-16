import { useTemplateStore } from '../../store/templateStore';
import { TextProperties } from './TextProperties';
import { ImageProperties } from './ImageProperties';
import { TableProperties } from './TableProperties';
import { GridContainerProperties } from './GridContainerProperties';
import { StackContainerProperties } from './StackContainerProperties';
import type { ComponentInstance } from '../../types/template';

// Helper function to find a component by ID, including nested children
function findComponentById(components: ComponentInstance[], id: string | null): ComponentInstance | undefined {
  if (!id) return undefined;

  for (const component of components) {
    if (component.id === id) {
      return component;
    }
    if (component.children) {
      const found = findComponentById(component.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

export function PropertyPanel() {
  const selectedComponentId = useTemplateStore((state) => state.selectedComponentId);
  const components = useTemplateStore((state) => state.components);
  const removeComponent = useTemplateStore((state) => state.removeComponent);
  const removeFromContainer = useTemplateStore((state) => state.removeFromContainer);
  const findParentContainer = useTemplateStore((state) => state.findParentContainer);

  const selectedComponent = findComponentById(components, selectedComponentId);

  if (!selectedComponent) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-4xl mb-3 opacity-30">✨</div>
        <p className="text-sm text-slate-lighter font-medium">Select a component</p>
        <p className="text-xs text-slate-lighter/60 mt-1">to edit its properties</p>
      </div>
    );
  }

  const handleDelete = () => {
    if (!selectedComponent) return;

    // Check if component is inside a container
    const parentContainer = findParentContainer(selectedComponent.id);

    if (parentContainer) {
      // Component is inside a container, use removeFromContainer
      removeFromContainer(parentContainer.id, selectedComponent.id);
    } else {
      // Component is at top level, use removeComponent
      removeComponent(selectedComponent.id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Component type indicator */}
      <div className="flex items-center justify-between p-4 bg-cream/50 border-2 border-cream-dark rounded-lg">
        <div className="text-sm font-serif font-semibold text-charcoal capitalize">
          {selectedComponent.type.replace('-', ' ')} Component
        </div>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 text-xs font-medium text-danger bg-danger/10 border border-danger/30 rounded hover:bg-danger/20 hover:border-danger active:scale-95 transition-all"
        >
          Delete
        </button>
      </div>

      {/* Component-specific properties */}
      <div className="space-y-4">
        {selectedComponent.type === 'text' && <TextProperties component={selectedComponent} />}
        {selectedComponent.type === 'image' && <ImageProperties component={selectedComponent} />}
        {selectedComponent.type === 'table' && <TableProperties component={selectedComponent} />}
        {selectedComponent.type === 'grid-container' && <GridContainerProperties component={selectedComponent} />}
        {selectedComponent.type === 'stack-container' && <StackContainerProperties component={selectedComponent} />}
      </div>
    </div>
  );
}
