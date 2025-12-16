import { useEffect } from 'react';
import { useTemplateStore } from '../../store/templateStore';
import type { Variable } from '../../types/template';
import { SectionHeader, EmptyState } from '../ui';

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
            <SectionHeader
                title="Variable Values"
                description="Enter values for preview"
            />

            <div className="flex-1 overflow-y-auto p-5">
                {variables.length === 0 ? (
                    <EmptyState
                        icon="📋"
                        message="No variables defined"
                        helperText="Add variables in Variable Manager"
                    />
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
