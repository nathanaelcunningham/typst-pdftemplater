import { useState } from 'react';
import { useTemplateStore } from '../../store/templateStore';

interface VariableSelectorProps {
  onSelect: (variablePath: string) => void;
}

export function VariableSelector({ onSelect }: VariableSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const variables = useTemplateStore((state) => state.variables);

  const handleSelect = (variablePath: string) => {
    onSelect(variablePath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
      >
        Insert Variable
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            {variables.length === 0 ? (
              <div className="p-4 text-sm text-gray-400 text-center">
                No variables defined
              </div>
            ) : (
              <div className="py-1">
                {variables.map((variable) => (
                  <button
                    key={variable.id}
                    onClick={() => handleSelect(`{{.${variable.path}}}`)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {variable.name}
                        </div>
                        {variable.description && (
                          <div className="text-xs text-gray-500 truncate">
                            {variable.description}
                          </div>
                        )}
                        <div className="text-xs font-mono text-blue-600 mt-1">
                          {`{{.${variable.path}}}`}
                        </div>
                      </div>
                      {variable.example && (
                        <div className="text-xs text-gray-400 italic whitespace-nowrap">
                          e.g., {variable.example}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
