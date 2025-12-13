import { useTemplateStore } from '../../store/templateStore';

interface VariableManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VariableManager({ isOpen, onClose }: VariableManagerProps) {
  const variables = useTemplateStore((state) => state.variables);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Available Variables</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Use these variables in your template by clicking "Insert Variable" in component properties
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {variables.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <p>No variables defined yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {variables.map((variable) => (
                  <div
                    key={variable.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{variable.name}</h3>
                          <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                            {variable.type}
                          </span>
                        </div>
                        {variable.description && (
                          <p className="text-sm text-gray-600 mb-2">{variable.description}</p>
                        )}
                        <code className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {`{{${variable.path}}}`}
                        </code>
                      </div>
                      {variable.example && (
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">Example:</div>
                          <div className="text-sm font-medium text-gray-700">{variable.example}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600">
              <strong>Tip:</strong> Variables are processed by your Go backend template engine before generating the PDF
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
