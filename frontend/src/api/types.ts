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

// Add more API types here as you expand the API
// Examples:
// export interface SaveTemplateRequest { ... }
// export interface LoadTemplateResponse { ... }
// export interface ListTemplatesResponse { ... }
