import ky from 'ky';

/**
 * Base API client configured with ky
 * Handles common configuration, headers, and error handling
 */

// Get base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://app.pdfgen.orb.local:1234';

// Create configured ky instance
export const apiClient = ky.create({
    prefixUrl: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
    retry: {
        limit: 2, // Retry failed requests twice
        methods: ['get', 'post', 'put', 'patch', 'delete'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    hooks: {
        beforeError: [
            async (error) => {
                // Enhanced error handling
                const { response } = error;
                if (response && response.body) {
                    try {
                        const contentType = response.headers.get('content-type');
                        let errorMessage = `Request failed: ${response.status} ${response.statusText}`;

                        if (contentType?.includes('application/json')) {
                            const errorData = await response.json() as any;
                            errorMessage = errorData.error || errorData.message || errorMessage;
                        } else {
                            const errorText = await response.text();
                            errorMessage = errorText || errorMessage;
                        }

                        error.message = errorMessage;
                    } catch {
                        // Use default error message
                    }
                }
                return error;
            },
        ],
    },
});

/**
 * Type-safe wrapper for API responses
 */
export type ApiResponse<T> = T;

/**
 * Export ky's HTTPError for error handling
 */
export { HTTPError } from 'ky';
