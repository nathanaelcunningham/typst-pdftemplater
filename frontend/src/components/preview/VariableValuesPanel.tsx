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
            <div className="p-6 border-b-2 border-cream-dark bg-gradient-to-b from-cream/50 to-transparent">
                <h2 className="text-lg font-serif font-semibold text-charcoal tracking-tight">
                    Variable Values
                </h2>
                <p className="text-xs text-slate-lighter mt-1">
                    Enter values for preview
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
                {variables.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-4xl mb-3 opacity-30">📋</div>
                        <p className="text-sm text-slate-lighter font-medium">No variables defined</p>
                        <p className="text-xs text-slate-lighter/60 mt-2">Add variables in Variable Manager</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {variables.map((variable) => {
                            const variableValue = preview.variableValues.find(
                                (vv) => vv.variableId === variable.id
                            );

                            return (
                                <div key={variable.id} className="space-y-2">
                                    <label className="block text-xs font-medium text-slate-light uppercase tracking-wider">
                                        {variable.name}
                                        <span className="ml-2 px-2 py-0.5 text-xs font-normal normal-case bg-slate/10 text-slate-light border border-slate/20 rounded">
                                            {variable.type}
                                        </span>
                                    </label>

                                    {variable.description && (
                                        <p className="text-xs text-slate-lighter">{variable.description}</p>
                                    )}

                                    <input
                                        type={getInputType(variable.type)}
                                        value={variableValue?.value || ''}
                                        onChange={(e) => updateVariableValue(variable.id, e.target.value)}
                                        placeholder={`Enter ${variable.name}`}
                                        className="w-full px-3 py-2.5 text-sm border-2 border-cream-dark rounded-md bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                                    />

                                    <p className="text-xs text-slate-lighter/60 font-mono">{`{{${variable.path}}}`}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
