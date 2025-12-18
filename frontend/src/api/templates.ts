import { apiClient } from './client';
import type { CompileRequest, Template, CreateTemplateRequest, UpdateTemplateRequest } from './types';

/**
 * Templates API service
 * Handles all template-related API calls
 */

/**
 * Preview a template by compiling Typst code to PDF
 * @param request - Compile request with Typst code and variables
 * @returns Blob for the compiled PDF
 */
export async function previewTemplate(request: CompileRequest): Promise<Blob> {
    const blob = await apiClient.post('api/templates/preview', {
        json: request,
    }).blob();

    return blob;
}

/**
 * List all templates
 * @returns Array of templates
 */
export async function listTemplates(): Promise<Template[]> {
    const response = await apiClient.get('api/templates').json<{ templates: Template[] }>();
    return response.templates;
}

/**
 * Get a specific template by ID
 * @param id - Template ID
 * @returns Template data
 */
export async function getTemplate(id: string): Promise<Template> {
    const response = await apiClient.get(`api/templates/${id}`).json<{ template: Template }>();
    return response.template
}

/**
 * Create a new template
 * @param request - Template creation data
 * @returns Created template
 */
export async function createTemplate(request: CreateTemplateRequest): Promise<Template> {
    const response = await apiClient.post('api/templates', {
        json: request,
    }).json<{ template: Template }>();
    return response.template
}

/**
 * Update an existing template
 * @param id - Template ID
 * @param request - Template update data
 * @returns Updated template
 */
export async function updateTemplate(id: string, request: UpdateTemplateRequest): Promise<Template> {
    const response = await apiClient.put(`api/templates/${id}`, {
        json: request,
    }).json<{ template: Template }>();

    return response.template
}

/**
 * archive a template
 * @param id - Template ID
 */
export async function archiveTemplate(id: string): Promise<void> {
    await apiClient.delete(`api/templates/${id}`);
}
