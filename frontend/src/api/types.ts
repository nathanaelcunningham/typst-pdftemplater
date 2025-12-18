/**
 * Shared API types and interfaces
 */

// Template-related types
export interface CompileRequest {
    typstCode: string;
    variables: Record<string, string>; // path -> value map
}

export interface CompileResponse {
    pdf: Blob;
}

// Template CRUD types
export interface TemplateContent {
    grid: {
        columns: number;
        gap: number;
    };
    components: any[]; // ComponentInstance[]
    variables: any[];  // Variable[]
}

export interface Template {
    id: string;
    name: string;
    description: string;
    content: TemplateContent;
    archived: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTemplateRequest {
    name: string;
    description: string;
    content: TemplateContent;
}

export interface UpdateTemplateRequest {
    name?: string;
    description?: string;
    content?: TemplateContent;
}

export interface ListTemplatesResponse {
    templates: Template[];
}
