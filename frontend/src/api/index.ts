/**
 * API module barrel exports
 * Provides clean imports for API functionality
 */

// Export client and error types
export { apiClient, HTTPError } from './client';
export type { ApiResponse } from './client';

// Export API types
export type { CompileRequest, CompileResponse } from './types';

// Export template services
export { previewTemplate } from './templates';
