// Component-specific prop type definitions

export interface TextComponentProps {
    content: string;                              // Text content with {{.Variable}} support
    fontSize: number;                             // Font size in points (default: 12)
    fontWeight: 'normal' | 'bold';                // Font weight
    alignment: 'left' | 'center' | 'right';       // Text alignment
    color: string;                                // Hex color (default: '#000000')
}

export interface ImageComponentProps {
    source: string;                               // Image path or {{.Variable}}
    width: number | 'auto';                       // Width in points or auto
    height: number | 'auto';                      // Height in points or auto
    alignment: 'left' | 'center' | 'right';       // Image alignment
    alt: string;                                  // Alt text description
}

export interface TableComponentProps {
    columns: number;                              // Number of columns
    headers: string[];                            // Header text (can include {{.Variable}})
    rows: string[][];                             // Row data (can include {{.Variable}})
    borders: boolean;                             // Show table borders
}

// Default props for each component type
export const defaultTextProps: TextComponentProps = {
    content: 'Text',
    fontSize: 12,
    fontWeight: 'normal',
    alignment: 'left',
    color: '#000000',
};

export const defaultImageProps: ImageComponentProps = {
    source: '',
    width: 'auto',
    height: 'auto',
    alignment: 'center',
    alt: 'Image',
};

export const defaultTableProps: TableComponentProps = {
    columns: 3,
    headers: ['Column 1', 'Column 2', 'Column 3'],
    rows: [
        ['Row 1, Col 1', 'Row 1, Col 2', 'Row 1, Col 3'],
    ],
    borders: true,
};

export interface GridContainerProps {
    columns: number[];                            // Column fractions [1, 2, 1] → 1fr 2fr 1fr
    gap: number;                                  // Horizontal gap in points (default: 16)
    rowGap?: number;                              // Vertical gap in points (optional)
    alignment?: 'start' | 'center' | 'end' | 'stretch';  // Vertical alignment
}

export const defaultGridContainerProps: GridContainerProps = {
    columns: [1],  // Start with single column
    gap: 16,
    alignment: 'start',
};

export interface StackContainerProps {
    direction: 'vertical' | 'horizontal';         // Stack direction
    spacing: number;                              // Gap between items in points (default: 8)
    alignment?: 'left' | 'center' | 'right';      // Horizontal alignment
}

export const defaultStackContainerProps: StackContainerProps = {
    direction: 'vertical',
    spacing: 8,
    alignment: 'left',
};

export interface PageBreakComponentProps {
    weak: boolean;                                   // Can be skipped if already at page boundary
    to: 'none' | 'odd' | 'even';                     // Force to odd or even page
}

export const defaultPageBreakProps: PageBreakComponentProps = {
    weak: false,
    to: 'none',
};

export interface HeadingComponentProps {
    content: string;
    level: HeadingLevel;
    alignment: 'left' | 'center' | 'right';
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export const defaultHeadingProps: HeadingComponentProps = {
    content: 'Heading',
    level: 1,
    alignment: 'left'
}
