import type { ComponentInstance } from '../../types/template';
import type { ImageComponentProps } from '../../types/components';

interface ImageComponentRenderProps {
    component: ComponentInstance;
    isSelected?: boolean;
    onClick?: () => void;
}

export function ImageComponent({ component, isSelected, onClick }: ImageComponentRenderProps) {
    const props = component.props as ImageComponentProps;

    return (
        <div
            onClick={onClick}
            className={`p-3 rounded cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
            style={{
                textAlign: props.alignment,
            }}
        >
            {props.source ? (
                props.source.includes('{{') ? (
                    // Show placeholder for variable-based image
                    <div
                        className="inline-flex items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400 rounded"
                        style={{
                            width: props.width === 'auto' ? '200px' : `${props.width}px`,
                            height: props.height === 'auto' ? '150px' : `${props.height}px`,
                        }}
                    >
                        <div className="text-center text-gray-600">
                            <div className="text-2xl mb-2">🖼️</div>
                            <div className="text-xs font-mono">{props.source}</div>
                        </div>
                    </div>
                ) : (
                    // Show actual image
                    <img
                        src={props.source}
                        alt={props.alt}
                        className="max-w-full rounded"
                        style={{
                            width: props.width === 'auto' ? 'auto' : `${props.width}px`,
                            height: props.height === 'auto' ? 'auto' : `${props.height}px`,
                        }}
                    />
                )
            ) : (
                // Show placeholder when no source
                <div
                    className="inline-flex items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400 rounded"
                    style={{
                        width: props.width === 'auto' ? '200px' : `${props.width}px`,
                        height: props.height === 'auto' ? '150px' : `${props.height}px`,
                    }}
                >
                    <div className="text-center text-gray-600">
                        <div className="text-2xl">🖼️</div>
                        <div className="text-xs mt-2">No image</div>
                    </div>
                </div>
            )}
        </div>
    );
}
