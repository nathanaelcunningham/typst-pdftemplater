import type { SpacerComponentProps } from "../../types/components";
import type { ComponentInstance } from "../../types/template";

interface SpacerComponentRenderProps {
    component: ComponentInstance;
    isSelected?: boolean;
    onClick?: () => void;
}

export function SpacerComponent({ component, isSelected, onClick }: SpacerComponentRenderProps) {
    const props = component.props as SpacerComponentProps;

    const getVisualSize = (amount: number): number => {
        return Math.max(20, Math.min(amount * 1.333, 200));
    };

    const visualSize = getVisualSize(props.amount);
    const displayValue = `${props.amount}pt`;

    if (props.direction === 'vertical') {
        return (
            <div
                onClick={onClick}
                className={`cursor-pointer transition-all border-2 border-dashed ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50/50 hover:bg-gray-100/50'
                    }`}
                style={{ height: `${visualSize}px` }}
            >
                <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-1">
                        {/* Vertical arrows */}
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4" />
                        </svg>
                        <span className="text-xs font-medium text-gray-500">{displayValue}</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8v12m0 0l-4-4m4 4l4-4" />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    // Horizontal spacer
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer transition-all border-2 border-dashed py-8 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50/50 hover:bg-gray-100/50'
                }`}
        >
            <div className="flex items-center justify-center gap-2 px-3">
                {/* Left arrow */}
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>

                {/* Dashed line with label */}
                <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 border-t-2 border-dashed border-gray-400" />
                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{displayValue}</span>
                    <div className="flex-1 border-t-2 border-dashed border-gray-400" />
                </div>

                {/* Right arrow */}
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    );
}
