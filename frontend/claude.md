# PDF Template Builder - Frontend

## Project Overview

A React-based drag-and-drop template builder for creating PDF templates. The builder generates Typst code with Go template variable syntax (e.g., `{{.CustomerName}}`).

### Tech Stack

- **React 19** + **TypeScript** (strict mode)
- **Zustand** (state management) + **Immer** (immutable updates)
- **dnd-kit** (drag and drop)
- **Tailwind CSS v4** (styling)
- **Vite** (build tool)

### Output Format

Typst code with Go template syntax:
```typst
#text(size: 12pt)[Hello {{.CustomerName}}]
#grid(
  columns: (1fr, 1fr),
  gutter: 16pt,
  #text()[{{.OrderNumber}}],
  #text()[{{.Date}}]
)
```

---

## Architecture

### Core Concepts

#### 1. Position System (Discriminated Union)

Components can have **absolute** or **relative** positions:

```typescript
type Position = AbsolutePosition | RelativePosition;

interface AbsolutePosition {
  type: 'absolute';
  row: number;      // Row in global grid (0-indexed)
  column: number;   // Starting column (0-11)
  span: number;     // Column span (1-12)
}

interface RelativePosition {
  type: 'relative';
  index: number;    // Order within container (0-indexed)
}
```

- **Absolute**: Top-level components on the canvas (uses 12-column grid)
- **Relative**: Components inside containers (positioned by index)

#### 2. Component Types

**Content Components:**
- `text` - Text with styling (font size, weight, color, alignment)
- `image` - Images with width/height/alignment
- `table` - Tables with headers, rows, borders

**Layout Components (Containers):**
- `grid-container` - Side-by-side layout with fractional column widths
- `stack-container` - Vertical or horizontal stacking with spacing

**Key Rule:** No nesting - containers can only contain content components, not other containers.

#### 3. Container Architecture

Containers have a `children` array:

```typescript
interface ComponentInstance {
  id: string;
  type: ComponentType;
  position: Position;
  props: Record<string, any>;
  children?: ComponentInstance[];  // Only for containers
}
```

Example:
```typescript
{
  id: 'container-1',
  type: 'grid-container',
  position: { type: 'absolute', row: 0, column: 0, span: 12 },
  props: { columns: [1, 2, 1], gap: 16 },
  children: [
    { id: 'text-1', type: 'text', position: { type: 'relative', index: 0 }, ... },
    { id: 'text-2', type: 'text', position: { type: 'relative', index: 1 }, ... }
  ]
}
```

---

## File Structure

### Types (`src/types/`)

- **`template.ts`** - Core types (Position, ComponentInstance, TemplateState)
- **`components.ts`** - Component prop types and defaults

### Store (`src/store/`)

- **`templateStore.ts`** - Zustand store with Immer middleware

**Key Actions:**
- `addComponent`, `updateComponent`, `removeComponent`
- `wrapInContainer`, `unwrapContainer`
- `addToContainer`, `removeFromContainer`, `reorderInContainer`
- `updateContainerProps`

**Important:** Always use store actions, never mutate state directly!

### Generators (`src/generators/`)

- **`typstGenerator.ts`** - Main generator (groups by rows, handles top-level only)
- **`componentGenerators.ts`** - Individual component generators (recursive for containers)

**Pattern:** Recursive generation for containers:
```typescript
// Grid container generates its children recursively
children.map(child => componentGenerators[child.type]?.(child))
```

### Components (`src/components/`)

#### Layout (`layout/`)
- **`EditorLayout.tsx`** - Main 4-panel layout + DndContext + drop handling
- **`ComponentPalette.tsx`** - Draggable component palette (Content + Layout sections)
- **`Canvas.tsx`** - Main canvas wrapper
- **`PropertyEditor.tsx`** - Right sidebar property editor
- **`CodePreview.tsx`** - Bottom panel Typst code preview

#### Canvas (`canvas/`)
- **`GridContainer.tsx`** - Renders top-level grid (filters absolute positions)
- **`ComponentWrapper.tsx`** - Wraps each component, adds edge drop zones
- **`DropZone.tsx`** - Drop zone component (7 types)

#### Template Components (`template-components/`)
- **`TextComponent.tsx`** - Renders text
- **`ImageComponent.tsx`** - Renders image
- **`TableComponent.tsx`** - Renders table
- **`GridContainerComponent.tsx`** - Renders grid container (shows interior drop zone when empty)
- **`StackContainerComponent.tsx`** - Renders stack container (shows interior drop zone when empty)

#### Property Editors (`properties/`)
- **`TextProperties.tsx`** - Edit text props
- **`ImageProperties.tsx`** - Edit image props
- **`TableProperties.tsx`** - Edit table props
- **`GridContainerProperties.tsx`** - Edit grid container (columns, gap, alignment, unwrap)
- **`StackContainerProperties.tsx`** - Edit stack container (direction, spacing, alignment, unwrap)
- **`PropertyPanel.tsx`** - Routes to correct property editor

---

## Drop Zone System

### 7 Drop Zone Types

1. **`canvas-empty`** - Empty canvas (initial state)
2. **`canvas-new-row`** - New row at bottom
3. **`component-above`** - Above existing component (blue horizontal line)
4. **`component-below`** - Below existing component (blue horizontal line)
5. **`component-left`** - Left of component (purple vertical line, auto-wraps in grid)
6. **`component-right`** - Right of component (purple vertical line, auto-wraps in grid)
7. **`container-interior`** - Inside empty container

### Visual Feedback

- **Blue lines** = Insert above/below (new row)
- **Purple lines** = Auto-wrap left/right (creates/adds to grid container)
- **Box areas** = Canvas drops

### Drop Handling (`EditorLayout.tsx` → `handleDragEnd`)

Uses a **switch statement** to handle each drop type:

```typescript
switch (dropType) {
  case 'canvas-empty':
  case 'canvas-new-row':
    // Create component at position
    // Initialize children[] for containers
    addComponent(newComponent);
    break;

  case 'component-above':
  case 'component-below':
    // Shift rows, insert new row
    // Initialize children[] for containers
    addComponent(newComponent);
    break;

  case 'component-left':
  case 'component-right':
    // Check if target is already in grid container
    // If yes: add to existing container
    // If no: create new grid container wrapping both
    break;

  case 'container-interior':
    // Add to container using store action
    addToContainer(containerId, newComponent);
    break;
}
```

**Critical:** For `container-interior`, always use `addToContainer()` action, never mutate `container.children` directly!

---

## Key Patterns & Best Practices

### 1. Type Guards

Always use type guards when accessing position properties:

```typescript
if (hasAbsolutePosition(component.position)) {
  const row = component.position.row;  // Safe!
}
```

### 2. Store Mutations

Always use store actions, never mutate directly:

```typescript
// ❌ WRONG
container.children.push(newComponent);

// ✅ CORRECT
addToContainer(containerId, newComponent);
```

### 3. Container Children Initialization

When creating containers from palette, always initialize `children`:

```typescript
if (componentType === 'grid-container' || componentType === 'stack-container') {
  newComponent.children = [];
}
```

### 4. Recursive Generation

Container generators call child generators recursively:

```typescript
children.map(child => componentGenerators[child.type]?.(child))
```

### 5. Top-Level Filtering

Only render components with absolute positions at top level:

```typescript
const topLevelComponents = components.filter(c => hasAbsolutePosition(c.position));
```

---

## Current State (Complete Features)

✅ **Phase 1-8: Container System** - Fully implemented
- Position discriminated union
- Container types (Grid + Stack)
- Store actions for container management
- Typst generation with recursion
- UI rendering for containers
- Edge-based drop zones (7 types)
- Auto-wrap logic (left/right drops)
- Property editors for containers
- Palette with categories

✅ **Core Features:**
- Drag and drop from palette
- 3 content components (Text, Image, Table)
- 2 layout components (Grid Container, Stack Container)
- Property editing for all component types
- Variable insertion (`{{.Variable}}`)
- Typst code generation and preview
- Keyboard shortcuts (Delete, Escape)

✅ **Recent Fixes:**
- Interior drop zones in empty containers
- Container children initialization
- Direct mutation bug (use store actions)
- Switch statement refactor in handleDragEnd

---

## Known Issues / TODOs

### Potential Improvements

1. **Edge drop zones on container children** - Currently only top-level components have edge drop zones
2. **Drag to reorder** - Can't reorder components within containers by dragging
3. **Container validation** - Prevent dropping containers inside containers at UI level
4. **Undo/Redo** - No history management
5. **Persistence** - No save/load functionality
6. **Export** - No actual PDF generation (only Typst code)

### Code Quality

From earlier code review (deferred):
- Type safety: Replace `Record<string, any>` with proper unions
- Error handling: Add error boundaries, clipboard validation
- Accessibility: Keyboard navigation, ARIA labels
- Performance: Add memoization for expensive operations

---

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Type check + build
npm run build

# Type check only
npx tsc --noEmit
```

---

## Working with the Codebase

### Adding a New Component Type

1. Add type to `ComponentType` in `types/template.ts`
2. Create prop interface in `types/components.ts` + default props
3. Create component renderer in `template-components/`
4. Create property editor in `properties/`
5. Add generator function in `componentGenerators.ts`
6. Update `ComponentWrapper.tsx` switch statement
7. Update `PropertyPanel.tsx` routing
8. Add to palette in `ComponentPalette.tsx`
9. Add default props in `EditorLayout.tsx` switch

### Adding a New Drop Zone Type

1. Add to `DropZoneType` in `types/template.ts`
2. Add visual styling in `DropZone.tsx`
3. Add case in `EditorLayout.tsx` → `handleDragEnd` switch
4. Add drop zone to appropriate component/container

### Debugging Tips

- Check if `components` array is mutating properly (use Zustand devtools)
- Verify position types with type guards before accessing properties
- Check drop zone data structure in `handleDragEnd`
- Verify Typst generation in CodePreview panel
- Use React DevTools to inspect component state

---

## Important Notes

⚠️ **Immer + Zustand:** State is immutable outside `set()` calls. Always use store actions.

⚠️ **Position Types:** Never access `.row`, `.column`, or `.span` without checking `hasAbsolutePosition()` first.

⚠️ **Container Rules:** No nesting allowed. Containers can only contain content components.

⚠️ **Drop Handling:** Must initialize `children: []` for containers created from palette.

⚠️ **Typst Output:** Grid uses fractional units `(1fr, 2fr)`, Stack uses `ttb` (top-to-bottom) or `ltr` (left-to-right).

---

## Questions to Ask When Continuing

1. What feature are we adding/fixing?
2. Does it affect the type system? (Position, ComponentType, etc.)
3. Does it need a new store action or can we use existing ones?
4. Does it need a new drop zone type?
5. How should it generate Typst code?
6. Does it need property editing?

---

## Context for Claude

This project was built incrementally over 8 phases:
1. Foundation (type system)
2. Store enhancement (container actions)
3. Typst generation (recursive)
4. UI rendering (container components)
5. Drop zones (edge-based)
6. Auto-wrap logic (left/right drops)
7. Property editors (container editing)
8. Palette & polish (categories, defaults)

The architecture uses discriminated unions for type safety, Zustand with Immer for state management, and dnd-kit for drag and drop. The key innovation is the Position system allowing both absolute (top-level) and relative (container child) positioning.

All code should follow these principles:
- Type safety with discriminated unions
- Immutable state updates through store actions
- Recursive rendering/generation for containers
- Clear separation between content and layout components
