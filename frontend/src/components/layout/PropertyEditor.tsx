import { PropertyPanel } from '../properties/PropertyPanel';
import { SectionHeader } from '../ui';

export function PropertyEditor() {
  return (
    <div className="flex flex-col h-full">
      <SectionHeader
        title="Properties"
        description="Configure selected component"
      />
      <div className="flex-1 overflow-y-auto p-5">
        <PropertyPanel />
      </div>
    </div>
  );
}
