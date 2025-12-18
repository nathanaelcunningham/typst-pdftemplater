import { AlertCircle, FileText } from 'lucide-react';
import { useTemplateStore } from '../../store/templateStore';
import { generateTypst } from '../../generators/typstGenerator';
import { previewTemplate, HTTPError } from '../../api';
import { Button } from '../ui';

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
            const typstCode = generateTypst({ components, grid });

            // Build variables map from variable values
            const variablesMap: Record<string, string> = {};
            preview.variableValues.forEach(vv => {
                const variable = variables.find(v => v.id === vv.variableId);
                if (variable) {
                    variablesMap[variable.path] = vv.value;
                }
            });

            // Compile to PDF via API
            const blob = await previewTemplate({
                typstCode,
                variables: variablesMap,
            });

            // Create blob URL for iframe
            const pdfUrl = URL.createObjectURL(blob);
            setPreviewPdf(pdfUrl);
        } catch (error) {
            if (error instanceof HTTPError) {
                setPreviewError(`Compilation failed: ${error.message}`);
            } else {
                setPreviewError(error instanceof Error ? error.message : 'Unknown error');
            }
        } finally {
            setPreviewLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-charcoal">
            {/* Preview Controls */}
            <div className="shrink-0 bg-paper border-b-2 border-cream-dark p-5">
                <Button
                    onClick={handleCompile}
                    disabled={preview.isLoading}
                    variant="primary"
                    className="w-full px-5 py-3"
                >
                    {preview.isLoading ? 'Compiling...' : 'Generate Preview'}
                </Button>
            </div>

            {/* PDF Viewer Section */}
            <div className="flex-1 overflow-hidden bg-charcoal">
                {preview.isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-amber border-t-transparent mb-4"></div>
                            <p className="text-cream font-medium">Compiling PDF...</p>
                            <p className="text-slate-lighter text-sm mt-2">This may take a moment</p>
                        </div>
                    </div>
                ) : preview.error ? (
                    <div className="flex items-center justify-center h-full bg-danger/5 p-8">
                        <div className="max-w-2xl w-full">
                            <div className="text-danger text-center mb-4">
                                <AlertCircle className="inline-block w-12 h-12 mb-2" />
                                <h3 className="text-lg font-serif font-semibold">Compilation Error</h3>
                            </div>
                            <pre className="text-xs font-mono bg-paper border-2 border-danger/30 rounded-lg p-4 overflow-auto max-h-96 text-left text-ink leading-relaxed">
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
                        <div className="text-center text-slate-lighter">
                            <FileText className="inline-block w-16 h-16 mb-4 opacity-30" />
                            <p className="text-sm font-medium mb-2">Ready to Preview</p>
                            <p className="text-xs opacity-60 max-w-xs mx-auto">Fill in variables and click "Generate Preview" to compile PDF</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
