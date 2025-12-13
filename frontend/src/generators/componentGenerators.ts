import type { ComponentInstance } from '../types/template';
import { hasRelativePosition } from '../types/template';
import type { TextComponentProps, ImageComponentProps, TableComponentProps, GridContainerProps, StackContainerProps } from '../types/components';

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

    const content = props.content.trimEnd().replaceAll("\n", "\\\n")
    // Build the text directive
    let code = `#text(${params.join(', ')})[${content || ''}]`;

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

export function generateGridContainerComponent(component: ComponentInstance): string {
    const props = component.props as GridContainerProps;
    const children = component.children || [];

    // Sort children by relative index
    const sorted = [...children].sort((a, b) => {
        const aIdx = hasRelativePosition(a.position) ? a.position.index : 0;
        const bIdx = hasRelativePosition(b.position) ? b.position.index : 0;
        return aIdx - bIdx;
    });

    // Column widths as fractions
    const colWidths = props.columns.map(f => `${f}fr`).join(', ');

    // Recursively generate children
    const childCode = sorted
        .map(child => `[${componentGenerators[child.type]?.(child)}]` || '')
        .filter(Boolean)
        .join(',\n  ');

    const rowGutterLine = props.rowGap ? `  row-gutter: ${props.rowGap}pt,\n` : '';

    return `#grid(
  columns: (${colWidths}),
  gutter: ${props.gap}pt,
${rowGutterLine}  
${childCode}
)`;
}

export function generateStackContainerComponent(component: ComponentInstance): string {
    const props = component.props as StackContainerProps;
    const children = component.children || [];

    // Sort children by relative index
    const sorted = [...children].sort((a, b) => {
        const aIdx = hasRelativePosition(a.position) ? a.position.index : 0;
        const bIdx = hasRelativePosition(b.position) ? b.position.index : 0;
        return aIdx - bIdx;
    });

    const direction = props.direction === 'vertical' ? 'ttb' : 'ltr';

    // Recursively generate children with alignment if needed
    const childCode = sorted
        .map(child => {
            const code = componentGenerators[child.type]?.(child) || '';
            if (props.alignment && props.alignment !== 'left') {
                return `#align(${props.alignment})[\n    ${code}\n  ]`;
            }
            return code;
        })
        .filter(Boolean)
        .join(',\n  ');

    return `#stack(
  dir: ${direction},
  spacing: ${props.spacing}pt,
  ${childCode}
)`;
}

export const componentGenerators: Record<string, (component: ComponentInstance) => string> = {
    text: generateTextComponent,
    image: generateImageComponent,
    table: generateTableComponent,
    'grid-container': generateGridContainerComponent,
    'stack-container': generateStackContainerComponent,
};
