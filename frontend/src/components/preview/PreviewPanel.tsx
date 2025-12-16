import { useTemplateStore } from '../../store/templateStore';
import { generateTypst } from '../../generators/typstGenerator';
import { compileToPDF } from '../../api/pdfCompiler';

export function PreviewPanel() {
    const components = useTemplateStore((state) => state.components);
    const variables = useTemplateStore((state) => state.variables);
    const grid = useTemplateStore((state) => state.grid);
    const preview = useTemplateStore((state) => state.preview);

    const {
        setPreviewLoading,
        setPreviewPdf,
        setPreviewError,
    } = useTemplateStore();

    const handleCompile = async () => {
        try {
            setPreviewLoading(true);
            setPreviewError(null);

            // Generate Typst code
            const typstCode = generateTypst({
                components,
                variables,
                grid,
                selectedComponentId: null,
                isDragging: false,
            });

            // Compile to PDF
            const pdfUrl = await compileToPDF(typstCode, preview.variableValues, variables);

            setPreviewPdf(pdfUrl);
        } catch (error) {
            setPreviewError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setPreviewLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900">
            {/* Preview Controls */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
                <button
                    onClick={handleCompile}
                    disabled={preview.isLoading}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {preview.isLoading ? 'Compiling...' : 'Generate Preview'}
                </button>
            </div>

            {/* PDF Viewer Section */}
            <div className="flex-1 overflow-hidden bg-gray-900">
                {preview.isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                            <p className="text-white">Compiling PDF...</p>
                        </div>
                    </div>
                ) : preview.error ? (
                    <div className="flex items-center justify-center h-full bg-red-50 p-8">
                        <div className="max-w-2xl w-full">
                            <div className="text-red-600 text-center mb-4">
                                <svg
                                    className="inline-block w-12 h-12 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <h3 className="text-lg font-semibold">Compilation Error</h3>
                            </div>
                            <pre className="text-xs bg-white border border-red-200 rounded p-4 overflow-auto max-h-96 text-left">
                                {preview.error}
                            </pre>
                        </div>
                    </div>
                ) : preview.pdfUrl ? (
                    <iframe
                        src={preview.pdfUrl}
                        className="w-full h-full border-0"
                        title="PDF Preview"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-400">
                            <svg
                                className="inline-block w-16 h-16 mb-4 opacity-50"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <p className="text-sm">Fill in variables and click "Generate Preview" to compile PDF</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
