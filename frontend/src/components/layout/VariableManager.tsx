import { useState } from 'react';
import { useTemplateStore } from '../../store/templateStore';
import type { Variable } from '../../types/template';

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
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {isEditing ? (isCreating ? 'New Variable' : 'Edit Variable') : 'Available Variables'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        {!isEditing && (
                            <p className="text-sm text-gray-600 mt-2">
                                Use these variables in your template by clicking "Insert Variable" in component properties
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Customer Name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Path <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.path}
                                        onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                                        placeholder="e.g., .CustomerName"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Go template path (e.g., .Field, .Nested.Field, .Array[0])
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as Variable['type'] })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="string">String</option>
                                        <option value="number">Number</option>
                                        <option value="date">Date</option>
                                        <option value="array">Array</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Optional description"
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        {isCreating ? 'Create' : 'Save'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    {!isCreating && (
                                        <button
                                            onClick={handleDelete}
                                            className="ml-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <button
                                        onClick={handleNew}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        + New Variable
                                    </button>
                                </div>

                                {variables.length === 0 ? (
                                    <div className="text-center text-gray-400 py-12">
                                        <p>No variables defined yet</p>
                                        <p className="text-sm mt-2">Click "New Variable" to create one</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {variables.map((variable) => (
                                            <div
                                                key={variable.id}
                                                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                                                onClick={() => handleEdit(variable)}
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
                                                    </div>
                                                    <div className="text-right">
                                                        <code className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">
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
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <p className="text-xs text-gray-600">
                                <strong>Tip:</strong> Variables are processed by your Go backend template engine before generating the PDF
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
