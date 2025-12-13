import type { ComponentInstance } from '../../types/template';
import type { TableComponentProps } from '../../types/components';

interface TableComponentRenderProps {
    component: ComponentInstance;
    isSelected?: boolean;
    onClick?: () => void;
}

export function TableComponent({ component, isSelected, onClick }: TableComponentRenderProps) {
    const props = component.props as TableComponentProps;

    return (
        <div
            onClick={onClick}
            className={`p-3 rounded cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
        >
            <table className={`w-full text-sm ${props.borders ? 'border-collapse' : ''}`}>
                <thead>
                    <tr className="bg-gray-100">
                        {props.headers.map((header, index) => (
                            <th
                                key={index}
                                className={`px-3 py-2 text-left font-semibold ${props.borders ? 'border border-gray-300' : ''
                                    }`}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className={`px-3 py-2 ${props.borders ? 'border border-gray-300' : ''}`}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
