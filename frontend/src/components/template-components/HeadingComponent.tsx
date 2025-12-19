import type { HeadingComponentProps } from "../../types/components";
import type { ComponentInstance } from "../../types/template";

interface HeadingComponentRenderProps {
    component: ComponentInstance;
    isSelected?: boolean;
    onClick?: () => void;
}

export function HeadingComponent({ component, isSelected, onClick }: HeadingComponentRenderProps) {
    const props = component.props as HeadingComponentProps;

    // Map heading levels to font sizes
    const fontSizeMap: Record<number, string> = {
        1: '2rem',      // 32px
        2: '1.5rem',    // 24px
        3: '1.25rem',   // 20px
        4: '1.125rem',  // 18px
        5: '1rem',      // 16px
        6: '0.875rem',  // 14px
    };

    // Map heading levels to font weights
    const fontWeightMap: Record<number, string> = {
        1: '700',
        2: '700',
        3: '600',
        4: '600',
        5: '600',
        6: '600',
    };

    return (
        <div
            onClick={onClick}
            className={`p-3 rounded cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
            }`}
        >
            <div
                style={{
                    fontSize: fontSizeMap[props.level],
                    fontWeight: fontWeightMap[props.level],
                    textAlign: props.alignment,
                    lineHeight: '1.2',
                }}
            >
                {props.content || 'Heading'}
            </div>
        </div>
    );
}
