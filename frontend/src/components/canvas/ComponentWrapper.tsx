import type { ComponentInstance } from '../../types/template';
import { useTemplateStore } from '../../store/templateStore';
import { TextComponent } from '../template-components/TextComponent';
import { ImageComponent } from '../template-components/ImageComponent';
import { TableComponent } from '../template-components/TableComponent';

interface ComponentWrapperProps {
    component: ComponentInstance;
}

export function ComponentWrapper({ component }: ComponentWrapperProps) {
    const selectedComponentId = useTemplateStore((state) => state.selectedComponentId);
    const selectComponent = useTemplateStore((state) => state.selectComponent);

    const isSelected = selectedComponentId === component.id;

    const handleClick = () => {
        selectComponent(component.id);
    };

    // Render the appropriate component based on type
    const renderComponent = () => {
        switch (component.type) {
            case 'text':
                return <TextComponent component={component} isSelected={isSelected} onClick={handleClick} />;
            case 'image':
                return <ImageComponent component={component} isSelected={isSelected} onClick={handleClick} />;
            case 'table':
                return <TableComponent component={component} isSelected={isSelected} onClick={handleClick} />;
            default:
                return null;
        }
    };

    return <div className="relative">{renderComponent()}</div>;
}
