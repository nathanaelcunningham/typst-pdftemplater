import type { ComponentInstance } from '../../types/template';
import type { TableComponentProps } from '../../types/components';
import { useTemplateStore } from '../../store/templateStore';
import { NumberInput, Button } from '../ui';

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
            <NumberInput
                label="Columns"
                value={props.columns}
                onChange={(newColumns) => {
                    if (newColumns > 0) {
                        // Adjust headers and rows to match new column count
                        const newHeaders = Array(newColumns).fill('').map((_, i) => props.headers[i] || `Column ${i + 1}`);
                        const newRows = props.rows.map(row =>
                            Array(newColumns).fill('').map((_, i) => row[i] || '')
                        );
                        handleChange({ columns: newColumns, headers: newHeaders, rows: newRows });
                    }
                }}
                min={1}
                max={10}
            />

            {/* Headers */}
            <div>
                <label className="block text-xs font-medium text-slate-light uppercase tracking-wider mb-2">Headers</label>
                <div className="space-y-2">
                    {props.headers.map((header, index) => (
                        <input
                            key={index}
                            type="text"
                            value={header}
                            onChange={(e) => handleHeaderChange(index, e.target.value)}
                            className="w-full px-3 py-2.5 border-2 border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
                            placeholder={`Header ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Rows */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-light uppercase tracking-wider">Rows</label>
                    <Button onClick={addRow} variant="primary" size="sm">
                        + Add Row
                    </Button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {props.rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="border-2 border-cream-dark bg-cream/30 rounded-md p-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-light">Row {rowIndex + 1}</span>
                                {props.rows.length > 1 && (
                                    <button
                                        onClick={() => removeRow(rowIndex)}
                                        className="px-2 py-1 text-xs text-danger hover:bg-danger/10 rounded active:scale-95 transition-all"
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
                                    className="w-full px-2 py-1.5 border-2 border-cream-dark rounded text-xs bg-paper text-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
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
                    className="w-4 h-4 accent-amber border-2 border-cream-dark rounded focus:ring-2 focus:ring-amber/20"
                />
                <label htmlFor="borders" className="text-sm font-medium text-ink">
                    Show Borders
                </label>
            </div>

            <p className="text-xs text-slate-lighter">
                Use {`{{.Variable}}`} in cells for dynamic data or {`{{range .Items}}`} for repeated rows
            </p>
        </div>
    );
}
