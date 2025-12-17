/**
 * API module barrel exports
 * Provides clean imports for API functionality
 */

// Export client and error types
export { apiClient, HTTPError } from './client';
export type { ApiResponse } from './client';

// Export API types
export type {
  CompileRequest,
  CompileResponse,
  Template,
  TemplateContent,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  ListTemplatesResponse
} from './types';

// Export template services
export {
  previewTemplate,
  listTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from './templates';
