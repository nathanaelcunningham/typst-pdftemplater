import type { ComponentInstance } from '../../types/template';
import type { PageBreakComponentProps } from '../../types/components';

interface PageBreakComponentRenderProps {
    component: ComponentInstance;
    isSelected?: boolean;
    onClick?: () => void;
}

export function PageBreakComponent({ component, isSelected, onClick }: PageBreakComponentRenderProps) {
    const props = component.props as PageBreakComponentProps;

    return (
        <div
            onClick={onClick}
            className={`py-4 cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
            }`}
        >
            <div className="flex items-center gap-3 px-3">
                {/* Left dashed line */}
                <div className="flex-1 border-t-2 border-dashed border-gray-400" />

                {/* Label */}
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <span>📄</span>
                    <span>Page Break</span>
                    {props.to !== 'none' && (
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                            to {props.to}
                        </span>
                    )}
                    {props.weak && (
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                            weak
                        </span>
                    )}
                </div>

                {/* Right dashed line */}
                <div className="flex-1 border-t-2 border-dashed border-gray-400" />
            </div>
        </div>
    );
}
