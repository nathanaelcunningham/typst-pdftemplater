import type { ComponentInstance } from '../../types/template';
import type { TableComponentProps } from '../../types/components';
import { useTemplateStore } from '../../store/templateStore';

interface TablePropertiesProps {
    component: ComponentInstance;
}

export function TableProperties({ component }: TablePropertiesProps) {
    const updateComponent = useTemplateStore((state) => state.updateComponent);
    const props = component.props as TableComponentProps;

    const handleChange = (updates: Partial<TableComponentProps>) => {
        updateComponent(component.id, {
            props: { ...props, ...updates },
        });
    };

    const handleHeaderChange = (index: number, value: string) => {
        const newHeaders = [...props.headers];
        newHeaders[index] = value;
        handleChange({ headers: newHeaders });
    };

    const handleRowChange = (rowIndex: number, colIndex: number, value: string) => {
        const newRows = [...props.rows];
        newRows[rowIndex][colIndex] = value;
        handleChange({ rows: newRows });
    };

    const addRow = () => {
        const newRow = Array(props.columns).fill('');
        handleChange({ rows: [...props.rows, newRow] });
    };

    const removeRow = (rowIndex: number) => {
        const newRows = props.rows.filter((_, index) => index !== rowIndex);
        handleChange({ rows: newRows });
    };

    return (
        <div className="space-y-4">
            {/* Number of Columns */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
                <input
                    type="number"
                    value={props.columns}
                    onChange={(e) => {
                        const newColumns = Number(e.target.value);
                        if (newColumns > 0) {
                            // Adjust headers and rows to match new column count
                            const newHeaders = Array(newColumns).fill('').map((_, i) => props.headers[i] || `Column ${i + 1}`);
                            const newRows = props.rows.map(row =>
                                Array(newColumns).fill('').map((_, i) => row[i] || '')
                            );
                            handleChange({ columns: newColumns, headers: newHeaders, rows: newRows });
                        }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="10"
                />
            </div>

            {/* Headers */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Headers</label>
                <div className="space-y-2">
                    {props.headers.map((header, index) => (
                        <input
                            key={index}
                            type="text"
                            value={header}
                            onChange={(e) => handleHeaderChange(index, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Header ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Rows */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Rows</label>
                    <button
                        onClick={addRow}
                        className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                    >
                        + Add Row
                    </button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {props.rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="border border-gray-200 rounded-md p-2 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-500">Row {rowIndex + 1}</span>
                                {props.rows.length > 1 && (
                                    <button
                                        onClick={() => removeRow(rowIndex)}
                                        className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            {row.map((cell, colIndex) => (
                                <input
                                    key={colIndex}
                                    type="text"
                                    value={cell}
                                    onChange={(e) => handleRowChange(rowIndex, colIndex, e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={`${props.headers[colIndex] || `Col ${colIndex + 1}`}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Borders */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="borders"
                    checked={props.borders}
                    onChange={(e) => handleChange({ borders: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="borders" className="text-sm font-medium text-gray-700">
                    Show Borders
                </label>
            </div>

            <p className="text-xs text-gray-500">
                Use {`{{.Variable}}`} in cells for dynamic data or {`{{range .Items}}`} for repeated rows
            </p>
        </div>
    );
}
