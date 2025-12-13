import type { ComponentInstance } from '../../types/template';
import type { TextComponentProps } from '../../types/components';

interface TextComponentRenderProps {
    component: ComponentInstance;
    isSelected?: boolean;
    onClick?: () => void;
}

export function TextComponent({ component, isSelected, onClick }: TextComponentRenderProps) {
    const props = component.props as TextComponentProps;

    return (
        <div
            onClick={onClick}
            className={`p-3 rounded cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
            style={{
                fontSize: `${props.fontSize}px`,
                fontWeight: props.fontWeight,
                textAlign: props.alignment,
                color: props.color,
                whiteSpace: 'pre-wrap'
            }}
        >
            {props.content || 'Empty text'}
        </div>
    );
}
