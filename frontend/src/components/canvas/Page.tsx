interface PageProps {
    pageNumber: number;
    children: React.ReactNode;
}

export function Page({ pageNumber, children }: PageProps) {
    // A4 dimensions: 8.27" x 11.69" (595pt x 842pt)
    // Scale to fit canvas: use width of ~700px for comfortable viewing
    const pageWidth = 700;
    const pageHeight = 990; // Maintain A4 aspect ratio

    return (
        <div className="relative">
            {/* Page container with paper styling */}
            <div
                className="bg-paper rounded-lg shadow-lg border-2 border-cream-dark relative overflow-hidden mx-auto"
                style={{
                    width: `${pageWidth}px`,
                    minHeight: `${pageHeight}px`,
                }}
            >
                {/* Subtle decorative corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amber/20 rounded-tl-lg"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-amber/20 rounded-br-lg"></div>

                {/* Page content with padding */}
                <div className="p-10 relative z-10">
                    {children}
                </div>

                {/* Page number at bottom */}
                <div className="absolute bottom-3 left-0 right-0 text-center text-xs text-slate-light font-medium">
                    Page {pageNumber}
                </div>
            </div>
        </div>
    );
}
