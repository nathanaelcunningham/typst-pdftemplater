import type { ComponentInstance } from '../../types/template';
import { hasAbsolutePosition } from '../../types/template';
import { useTemplateStore } from '../../store/templateStore';
import { TextComponent } from '../template-components/TextComponent';
import { ImageComponent } from '../template-components/ImageComponent';
import { TableComponent } from '../template-components/TableComponent';
import { GridContainerComponent } from '../template-components/GridContainerComponent';
import { StackContainerComponent } from '../template-components/StackContainerComponent';
import { PageBreakComponent } from '../template-components/PageBreakComponent';
import { DropZone } from './DropZone';

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
            case 'grid-container':
                return <GridContainerComponent component={component} isSelected={isSelected} onClick={handleClick} />;
            case 'stack-container':
                return <StackContainerComponent component={component} isSelected={isSelected} onClick={handleClick} />;
            case 'page-break':
                return <PageBreakComponent component={component} isSelected={isSelected} onClick={handleClick} />;
            default:
                return null;
        }
    };

    // Only show edge drop zones for top-level components with absolute positions
    const showEdgeDropZones = hasAbsolutePosition(component.position);

    return (
        <div className="relative">
            {showEdgeDropZones && (
                <>
                    {/* Top - insert above */}
                    <div className="absolute -top-1 left-0 right-0 z-10">
                        <DropZone dropZoneType="component-above" targetComponentId={component.id} />
                    </div>

                    {/* Bottom - insert below */}
                    <div className="absolute -bottom-1 left-0 right-0 z-10">
                        <DropZone dropZoneType="component-below" targetComponentId={component.id} />
                    </div>

                    {/* Left - auto-wrap in grid */}
                    <div className="absolute -left-1 top-0 bottom-0 z-10 flex items-center">
                        <DropZone dropZoneType="component-left" targetComponentId={component.id} />
                    </div>

                    {/* Right - auto-wrap in grid */}
                    <div className="absolute -right-1 top-0 bottom-0 z-10 flex items-center">
                        <DropZone dropZoneType="component-right" targetComponentId={component.id} />
                    </div>
                </>
            )}

            {renderComponent()}
        </div>
    );
}
