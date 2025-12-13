import { useMemo } from 'react';
import { useTemplateStore } from '../../store/templateStore';
import { generateTypst } from '../../generators/typstGenerator';

export function CodePreview() {
  const components = useTemplateStore((state) => state.components);
  const variables = useTemplateStore((state) => state.variables);
  const grid = useTemplateStore((state) => state.grid);

  // Generate Typst code (memoized for performance)
  const typstCode = useMemo(() => {
    return generateTypst({ components, variables, grid, selectedComponentId: null, isDragging: false });
  }, [components, variables, grid]);

  const handleCopy = () => {
    navigator.clipboard.writeText(typstCode);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Typst Code Preview
        </h2>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
        >
          Copy
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-gray-50">
        <pre className="text-xs font-mono text-gray-600 whitespace-pre-wrap">
          {typstCode}
        </pre>
      </div>
    </div>
  );
}
