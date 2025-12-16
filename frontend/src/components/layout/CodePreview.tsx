import { useMemo, useState, useEffect } from 'react';
import { useTemplateStore } from '../../store/templateStore';
import { generateTypst } from '../../generators/typstGenerator';
import { PreviewPanel } from '../preview/PreviewPanel';

type TabType = 'code' | 'preview';

export function CodePreview() {
  const [activeTab, setActiveTab] = useState<TabType>('code');

  const components = useTemplateStore((state) => state.components);
  const variables = useTemplateStore((state) => state.variables);
  const grid = useTemplateStore((state) => state.grid);
  const clearPreview = useTemplateStore((state) => state.clearPreview);

  // Generate Typst code (memoized for performance)
  const typstCode = useMemo(() => {
    return generateTypst({ components, variables, grid, selectedComponentId: null, isDragging: false });
  }, [components, variables, grid]);

  const handleCopy = () => {
    navigator.clipboard.writeText(typstCode);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearPreview();
    };
  }, [clearPreview]);

  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className="flex items-center border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'code'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          Typst Code
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'preview'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          Preview
        </button>

        {/* Copy button - only show in Code tab */}
        {activeTab === 'code' && (
          <button
            onClick={handleCopy}
            className="ml-auto mr-3 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Copy
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'code' ? (
          <div className="h-full overflow-auto p-4 bg-gray-50">
            <pre className="text-xs font-mono text-gray-600 whitespace-pre-wrap">
              {typstCode}
            </pre>
          </div>
        ) : (
          <PreviewPanel />
        )}
      </div>
    </div>
  );
}
