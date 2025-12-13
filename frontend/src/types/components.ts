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
