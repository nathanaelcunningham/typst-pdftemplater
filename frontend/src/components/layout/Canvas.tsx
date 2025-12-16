import { GridContainer } from '../canvas/GridContainer';

export function Canvas() {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-paper rounded-lg shadow-lg border-2 border-cream-dark p-10 min-h-[calc(100vh-12rem)] relative overflow-hidden">
                {/* Subtle decorative corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amber/20 rounded-tl-lg"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-amber/20 rounded-br-lg"></div>

                <GridContainer />
            </div>
        </div>
    );
}
