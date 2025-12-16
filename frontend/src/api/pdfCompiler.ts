import type { Variable, VariableValue } from '../types/template';

export interface CompileRequest {
    typstCode: string;
    variables: Record<string, string>;  // path -> value map
}

/**
 * Compile Typst code to PDF via backend API
 *
 * @param typstCode - Generated Typst code with variable placeholders
 * @param variableValues - User-provided variable values
 * @param variables - Variable definitions from VariableManager
 * @returns Blob URL for the compiled PDF
 * @throws Error if compilation fails
 */
export async function compileToPDF(
    typstCode: string,
    variableValues: VariableValue[],
    variables: Variable[]
): Promise<string> {
    // Build variables map: { "CustomerName": "John", "OrderNumber": "12345" }
    // Variable paths are stored without the dot, which is only added during Typst generation
    const variablesMap: Record<string, string> = {};

    variableValues.forEach(vv => {
        const variable = variables.find(v => v.id === vv.variableId);
        if (variable) {
            variablesMap[variable.path] = vv.value;
        }
    });

    // Prepare request body
    const requestBody: CompileRequest = {
        typstCode,
        variables: variablesMap,
    };

    // POST to backend
    const response = await fetch('http://app.pdfgen.orb.local:1234/api/templates/preview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `Compilation failed: ${response.status} ${response.statusText}`;

        try {
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } else {
                const errorText = await response.text();
                if (errorText) {
                    errorMessage = errorText;
                }
            }
        } catch (e) {
            // Ignore parse errors, use default message
        }

        throw new Error(errorMessage);
    }

    // Get PDF blob
    const blob = await response.blob();

    // Create blob URL
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
}
