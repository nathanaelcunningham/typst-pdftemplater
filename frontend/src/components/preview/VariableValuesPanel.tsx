import { useEffect } from 'react';
import { useTemplateStore } from '../../store/templateStore';
import type { Variable } from '../../types/template';

export function VariableValuesPanel() {
    const variables = useTemplateStore((state) => state.variables);
    const preview = useTemplateStore((state) => state.preview);
    const { updateVariableValue, initializeVariableValues } = useTemplateStore();

    // Initialize variable values on mount and when variables change
    useEffect(() => {
        initializeVariableValues();
    }, [variables, initializeVariableValues]);

    const getInputType = (varType: Variable['type']): string => {
        switch (varType) {
            case 'number':
                return 'number';
            case 'date':
                return 'date';
            default:
                return 'text';
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Variable Values
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                    Enter values for preview
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {variables.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                        No variables defined. Add variables in Variable Manager.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {variables.map((variable) => {
                            const variableValue = preview.variableValues.find(
                                (vv) => vv.variableId === variable.id
                            );

                            return (
                                <div key={variable.id} className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {variable.name}
                                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                                            {variable.type}
                                        </span>
                                    </label>

                                    {variable.description && (
                                        <p className="text-xs text-gray-500">{variable.description}</p>
                                    )}

                                    <input
                                        type={getInputType(variable.type)}
                                        value={variableValue?.value || ''}
                                        onChange={(e) => updateVariableValue(variable.id, e.target.value)}
                                        placeholder={`Enter ${variable.name}`}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    <p className="text-xs text-gray-400 font-mono">{`{{.${variable.path}}}`}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
