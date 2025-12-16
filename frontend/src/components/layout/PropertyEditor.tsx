import { PropertyPanel } from '../properties/PropertyPanel';

export function PropertyEditor() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b-2 border-cream-dark bg-gradient-to-b from-cream/50 to-transparent">
        <h2 className="text-lg font-serif font-semibold text-charcoal tracking-tight">
          Properties
        </h2>
        <p className="text-xs text-slate-lighter mt-1">Configure selected component</p>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <PropertyPanel />
      </div>
    </div>
  );
}
