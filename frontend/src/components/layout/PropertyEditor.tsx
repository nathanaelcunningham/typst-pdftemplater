import { PropertyPanel } from '../properties/PropertyPanel';

export function PropertyEditor() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Properties
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <PropertyPanel />
      </div>
    </div>
  );
}
