import { useState } from 'react';
import { useTemplateStore } from '../../store/templateStore';
import type { Variable } from '../../types/template';
import { TextInput, Select, Textarea, Button, EmptyState } from '../ui';

interface VariableManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function VariableManager({ isOpen, onClose }: VariableManagerProps) {
    const variables = useTemplateStore((state) => state.variables);
    const addVariable = useTemplateStore((state) => state.addVariable);
    const updateVariable = useTemplateStore((state) => state.updateVariable);
    const removeVariable = useTemplateStore((state) => state.removeVariable);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<Omit<Variable, 'id'>>({
        name: '',
        path: '',
        type: 'string',
        description: '',
    });

    if (!isOpen) return null;

    const handleEdit = (variable: Variable) => {
        setEditingId(variable.id);
        setFormData({
            name: variable.name,
            path: variable.path,
            type: variable.type,
            description: variable.description || '',
        });
        setIsCreating(false);
    };

    const handleNew = () => {
        setIsCreating(true);
        setEditingId(null);
        setFormData({
            name: '',
            path: '',
            type: 'string',
            description: '',
        });
    };

    const handleSave = () => {
        if (!formData.name.trim() || !formData.path.trim()) {
            alert('Name and path are required');
            return;
        }

        if (isCreating) {
            addVariable({
                id: `var-${Date.now()}`,
                ...formData,
            });
        } else if (editingId) {
            updateVariable(editingId, formData);
        }

        handleCancel();
    };

    const handleDelete = () => {
        if (editingId && confirm('Are you sure you want to delete this variable?')) {
            removeVariable(editingId);
            handleCancel();
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
        setFormData({
            name: '',
            path: '',
            type: 'string',
            description: '',
        });
    };

    const isEditing = isCreating || editingId !== null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-charcoal/70 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-paper rounded-lg shadow-2xl border-2 border-cream-dark max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="p-6 border-b-2 border-cream-dark bg-gradient-to-b from-cream/50 to-transparent">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-serif font-semibold text-charcoal">
                                {isEditing ? (isCreating ? 'New Variable' : 'Edit Variable') : 'Available Variables'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-slate-light hover:text-charcoal text-2xl leading-none w-8 h-8 flex items-center justify-center hover:bg-cream rounded transition-all"
                            >
                                &times;
                            </button>
                        </div>
                        {!isEditing && (
                            <p className="text-sm text-slate-lighter mt-2">
                                Use these variables in your template by clicking "Insert Variable" in component properties
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {isEditing ? (
                            <div className="space-y-4">
                                <TextInput
                                    label={<>Name <span className="text-danger">*</span></>}
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Customer Name"
                                />

                                <TextInput
                                    label={<>Path <span className="text-danger">*</span></>}
                                    type="text"
                                    value={formData.path}
                                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                                    placeholder="e.g., .CustomerName"
                                    helperText="Go template path (e.g., .Field, .Nested.Field, .Array[0])"
                                    className="font-mono"
                                />

                                <Select
                                    label="Type"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Variable['type'] })}
                                    options={[
                                        { value: 'string', label: 'String' },
                                        { value: 'number', label: 'Number' },
                                        { value: 'date', label: 'Date' },
                                        { value: 'array', label: 'Array' },
                                    ]}
                                />

                                <Textarea
                                    label="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Optional description"
                                    rows={3}
                                />

                                <div className="flex gap-2 pt-4">
                                    <Button onClick={handleSave} variant="primary">
                                        {isCreating ? 'Create' : 'Save'}
                                    </Button>
                                    <Button onClick={handleCancel} variant="secondary">
                                        Cancel
                                    </Button>
                                    {!isCreating && (
                                        <Button onClick={handleDelete} variant="danger" className="ml-auto">
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <Button onClick={handleNew} variant="primary">
                                        + New Variable
                                    </Button>
                                </div>

                                {variables.length === 0 ? (
                                    <EmptyState
                                        icon="📋"
                                        message="No variables defined yet"
                                        helperText='Click "New Variable" to create one'
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        {variables.map((variable) => (
                                            <div
                                                key={variable.id}
                                                className="p-4 border-2 border-cream-dark bg-cream/30 rounded-lg hover:border-amber/50 hover:bg-amber/5 hover:shadow-md transition-all cursor-pointer group"
                                                onClick={() => handleEdit(variable)}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-serif font-semibold text-charcoal">{variable.name}</h3>
                                                            <span className="px-2 py-0.5 text-xs font-medium bg-slate/10 text-slate-light border border-slate/20 rounded">
                                                                {variable.type}
                                                            </span>
                                                        </div>
                                                        {variable.description && (
                                                            <p className="text-sm text-slate-lighter mb-2">{variable.description}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <code className="text-xs font-mono bg-amber/10 text-amber-dark border border-amber/30 px-2 py-1 rounded group-hover:bg-amber/20 transition-colors">
                                                            {`{{${variable.path}}}`}
                                                        </code>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    {!isEditing && (
                        <div className="p-6 border-t-2 border-cream-dark bg-gradient-to-t from-cream/30 to-transparent">
                            <p className="text-xs text-slate-lighter">
                                <strong className="font-semibold text-slate-light">Tip:</strong> Variables are processed by your Go backend template engine before generating the PDF
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
