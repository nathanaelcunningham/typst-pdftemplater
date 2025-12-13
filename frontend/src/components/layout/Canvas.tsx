import { GridContainer } from '../canvas/GridContainer';

export function Canvas() {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md min-h-[600px] p-8">
                <GridContainer />
            </div>
        </div>
    );
}
