import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ComponentInstance, Variable, Position, TemplateState } from '../types/template';

interface TemplateStore extends TemplateState {
    // Component actions
    addComponent: (component: ComponentInstance) => void;
    updateComponent: (id: string, updates: Partial<ComponentInstance>) => void;
    removeComponent: (id: string) => void;
    moveComponent: (id: string, newPosition: Position) => void;
    selectComponent: (id: string | null) => void;
    setDragging: (isDragging: boolean) => void;

    // Variable actions
    addVariable: (variable: Variable) => void;
    updateVariable: (id: string, updates: Partial<Variable>) => void;
    removeVariable: (id: string) => void;

    // Grid actions
    setGridColumns: (columns: number) => void;
    setGridGap: (gap: number) => void;
}

export const useTemplateStore = create<TemplateStore>()(
    immer((set) => ({
        // Initial state
        grid: {
            columns: 12,
            gap: 16,
        },
        components: [],
        variables: [
            // Predefined common variables
            {
                id: 'var-1',
                name: 'Customer Name',
                path: '.CustomerName',
                type: 'string',
                description: 'Name of the customer',
                example: 'John Doe',
            },
            {
                id: 'var-2',
                name: 'Order Number',
                path: '.OrderNumber',
                type: 'string',
                description: 'Order identification number',
                example: 'ORD-12345',
            },
            {
                id: 'var-3',
                name: 'Date',
                path: '.Date',
                type: 'date',
                description: 'Current date',
                example: '2025-12-12',
            },
        ],
        selectedComponentId: null,
        isDragging: false,

        // Component actions
        addComponent: (component) =>
            set((state) => {
                state.components.push(component);
            }),

        updateComponent: (id, updates) =>
            set((state) => {
                const index = state.components.findIndex((c) => c.id === id);
                if (index !== -1) {
                    state.components[index] = { ...state.components[index], ...updates };
                }
            }),

        removeComponent: (id) =>
            set((state) => {
                state.components = state.components.filter((c) => c.id !== id);
                if (state.selectedComponentId === id) {
                    state.selectedComponentId = null;
                }
            }),

        moveComponent: (id, newPosition) =>
            set((state) => {
                const index = state.components.findIndex((c) => c.id === id);
                if (index !== -1) {
                    state.components[index].position = newPosition;
                }
            }),

        selectComponent: (id) =>
            set((state) => {
                state.selectedComponentId = id;
            }),

        setDragging: (isDragging) =>
            set((state) => {
                state.isDragging = isDragging;
            }),

        // Variable actions
        addVariable: (variable) =>
            set((state) => {
                state.variables.push(variable);
            }),

        updateVariable: (id, updates) =>
            set((state) => {
                const index = state.variables.findIndex((v) => v.id === id);
                if (index !== -1) {
                    state.variables[index] = { ...state.variables[index], ...updates };
                }
            }),

        removeVariable: (id) =>
            set((state) => {
                state.variables = state.variables.filter((v) => v.id !== id);
            }),

        // Grid actions
        setGridColumns: (columns) =>
            set((state) => {
                state.grid.columns = columns;
            }),

        setGridGap: (gap) =>
            set((state) => {
                state.grid.gap = gap;
            }),
    }))
);
