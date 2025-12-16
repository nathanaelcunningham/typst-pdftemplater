import { apiClient } from './client';
import type { CompileRequest } from './types';

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

// Add more template-related API calls here:
// export async function saveTemplate(...) { ... }
// export async function loadTemplate(...) { ... }
// export async function listTemplates(...) { ... }
// export async function deleteTemplate(...) { ... }
