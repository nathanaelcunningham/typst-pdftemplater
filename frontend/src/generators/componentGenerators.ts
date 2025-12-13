import type { ComponentInstance } from '../types/template';
import type { TextComponentProps, ImageComponentProps, TableComponentProps } from '../types/components';

export function generateTextComponent(component: ComponentInstance): string {
    const props = component.props as TextComponentProps;

    // Build text styling parameters
    const params: string[] = [`size: ${props.fontSize}pt`];

    if (props.fontWeight === 'bold') {
        params.push('weight: "bold"');
    }

    if (props.color !== '#000000') {
        // Convert hex to Typst color format (simplified)
        params.push(`fill: rgb("${props.color}")`);
    }

    // Build the text directive
    let code = `#text(${params.join(', ')})[${props.content || ''}]`;

    // Wrap in alignment if not left-aligned
    if (props.alignment !== 'left') {
        code = `#align(${props.alignment})[
  ${code}
]`;
    }

    return code;
}

export function generateImageComponent(component: ComponentInstance): string {
    const props = component.props as ImageComponentProps;

    // Build image parameters
    const params: string[] = [];

    if (props.width !== 'auto') {
        params.push(`width: ${props.width}pt`);
    }

    if (props.height !== 'auto') {
        params.push(`height: ${props.height}pt`);
    }

    // Build the image directive
    const imageParams = params.length > 0 ? `, ${params.join(', ')}` : '';
    let code = `#image("${props.source}"${imageParams})`;

    // Wrap in alignment if not left-aligned
    if (props.alignment !== 'left') {
        code = `#align(${props.alignment})[
  ${code}
]`;
    }

    return code;
}

export function generateTableComponent(component: ComponentInstance): string {
    const props = component.props as TableComponentProps;

    // Build table parameters
    const params: string[] = [`columns: ${props.columns}`];

    if (!props.borders) {
        params.push('stroke: none');
    }

    // Start table directive
    let code = `#table(
  ${params.join(', ')},\n`;

    // Add headers
    code += '  ' + props.headers.map(h => `[${h}]`).join(', ') + ',\n';

    // Add rows
    props.rows.forEach(row => {
        code += '  ' + row.map(cell => `[${cell}]`).join(', ') + ',\n';
    });

    code += ')';

    return code;
}

export const componentGenerators: Record<string, (component: ComponentInstance) => string> = {
    text: generateTextComponent,
    image: generateImageComponent,
    table: generateTableComponent,
};
