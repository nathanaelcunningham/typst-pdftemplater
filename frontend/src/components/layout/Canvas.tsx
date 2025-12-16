import { GridContainer } from '../canvas/GridContainer';

export function Canvas() {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 min-h-[calc(100vh-12rem)]">
                <GridContainer />
            </div>
        </div>
    );
}
