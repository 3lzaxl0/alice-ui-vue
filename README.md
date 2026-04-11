# Alice UI Vue - Technical Design Specification

**Version**: 1.1.0  
**Status**: Canonical / Master Documentation  
**Objective**: Unified design language and component registry for high-velocity, agnostic web development.

---

## 🤖 1. Directives for AI Agents

When interacting with this library, AI agents **MUST** follow these rules to ensure architectural integrity and development agility:

1. **Prop-First Rule**: Prioritize component props (`:icon`, `:variant`, `expanded`, `loading`) over manual slots or Tailwind classes.
2. **Semantic Variants**: Use the built-in semantic system (`primary`, `success`, `warning`, `error`, `info`, `neutral`). Do NOT manually apply text/border colors if a variant covers it.
3. **Lucide Integration**: Most components accept an `icon` prop which expects a Lucide icon component.
4. **Mobile Adaptivity**: Components with `mobileFullscreen` or `mobile` props should be preferred for high-quality mobile UX.
5. **Architectural Purity**: Do NOT instantiate UseCases or Business Logic inside UI components. Use the DI (Dependency Injection) container.
6. **No Ad-Hoc Styling**: Avoid `padding`, `margin`, and `shadow` classes in views; use library layout components.

---

## 🎨 2. Design Foundations & Tokens

### Colors (Semantic Scale)
| Case | Palette | Token Range | Description |
| :--- | :--- | :--- | :--- |
| `primary` | Blue | 50-950 | Main brand color. |
| `success` | Emerald | 50-950 | Positive states, successful actions. |
| `error` | Rose | 50-950 | Errors, destructive actions. |
| `warning` | Amber | 50-950 | Warnings, caution. |
| `info` | Sky | 50-950 | Informational feedback. |
| `neutral` | Slate/Gray | 50-950 | Borders, backgrounds, typography. |

### Shapes & Depth
- **Border Radius**: `alice-sm` (8px), `alice-md` (12px), `alice-lg` (16px), `alice-xl` (24px).
- **Shadows**: `alice-sm` (subtle), `alice-panel` (floating/depth), `alice-input` (inner soft).

---

## ✨ 3. Animation System (The "Alice Feel")

Standard cubic-beziers ensure every interaction feels premium.
- **Master Bezier**: `cubic-bezier(0.2, 0.8, 0.2, 1)` (Responsive start, smooth decay).
- **Transitions**:
  - `alice-dropdown`: Slide down + Fade.
  - `alice-pop`: Grow from point + Fade.
  - `alice-modal`: Slide up + Scale.
  - `alice-fade`: Simple 150ms opacity change.

---

## 🧱 4. Component Registry (Master Reference)

### 4.1 Actions & Core Inputs
| Component | Key Props | Description |
| :--- | :--- | :--- |
| **AliceButton** | `variant`, `design`, `size`, `icon`, `expanded`, `loading` | Logic-agnostic action element. |
| **AliceInput** | `label`, `icon`, `modelValue`, `error`, `clearable`, `size` | Standard text input with integrated label. |
| **AliceSelect** | `options`, `modelValue`, `clearable`, `label` | Searchable/Standard select with teleported listbox. |
| **AliceMultiSelect** | `options`, `modelValue` (array), `tags` | Multiple selection with tag management. |
| **AliceCheckbox** | `modelValue`, `label`, `disabled`, `indeterminate` | Semantic checkbox with scale animation. |
| **AliceRadio** | `modelValue`, `value`, `label` | Semantic radio group item. |
| **AliceDatePicker** | `modelValue`, `range` (boolean), `placeholder` | Single or range date selection. |
| **AliceSearchInput** | `modelValue`, `loading`, `placeholder` | Search-optimized input with integrated icon. |
| **AliceColorPicker** | `modelValue`, `presets` (boolean) | Theme-aware color selector. |
| **AliceSignature** | `modelValue` (base64/svg), `height` | Canvas-based signature capture. |
| **AliceImageUpload** | `modelValue`, `multiple`, `loading` | R2-optimized image uploader with WebP processing. |

### 4.2 Containers & Data Display
| Component | Key Props | Description |
| :--- | :--- | :--- |
| **AlicePanel** | `title`, `description`, `icon`, `collapsible`, `variant` | Structured section with header and optional collapse. |
| **AliceCard** | `title`, `subtitle`, `loading`, `radius`, `shadow` | Generic content container. |
| **AliceStat** | `variant`, `title`, `value`, `icon`, `interactive` | Semantic KPI with auto-coloring and NaN handling. |
| **AliceTable** | `columns`, `data`, `pagination`, `columnResize` | High-performance grid with virtual scroll. |
| **AliceActivityItem**| `icon`, `title`, `subtitle`, `amount`, `variant` | Standard row for logs or transaction feeds. |
| **AliceEntityCard** | `entity`, `actions` (slot), `variant` | Specialized card for rich object presentation. |
| **AliceBadge** | `label`, `variant`, `type` (soft/solid/outline) | Category/Status indicators. |
| **AliceText** | `variant` (h1, h2, label, caption), `tag` | Semantic typography controller. |
| **AliceIconInfo** | `icon`, `label`, `variant`, `size` | Horizontal "Icon + Label" helper. |

### 4.3 Layout & Structural
| Component | Key Props | Description |
| :--- | :--- | :--- |
| **AliceView** | `gap`, `padding`, `scrollable`, `loading` | Main page wrapper (recommended for all views). |
| **AliceContainer** | `maxWidth`, `centered`, `fluid` | Standard content wrapper for margin handling. |
| **AliceGrid** | `cols`, `smCols`, `lgCols`, `gap` | Responsive grid system. |
| **AlicePageHeader** | `title`, `subtitle`, `breadcrumb` | View-level header with action slots. |
| **AliceSidebar** | `isOpen`, `collapsed` | Core navigation shell. |
| **AliceSidebarItem** | `label`, `icon`, `active`, `to` | Single navigation entry. |
| **AliceDivider** | `label`, `align` | Visual separator with optional text. |
| **AliceFilterPanel** | `loading`, `minChildWidth` | Horizontal filter bar with auto-validation. |
| **AliceSegmentedControl** | `options`, `modelValue` | Switching control with sliding animations. |

### 4.4 Feedback & Overlays
| Component | Key Props | Description |
| :--- | :--- | :--- |
| **AliceLoading** | `active`, `type` (spinner/skeleton), `blur` | Full-panel or in-place loading overlay. |
| **AliceToast** | `title`, `message`, `type`, `duration` | Notification system (use `useAliceToast`). |
| **AliceDialog** | `show`, `title`, `size` (fullscreen/default) | Portal-based modal window. |
| **AliceDrawer** | `show`, `placement` (right/left), `width` | Side-emerging panel. |
| **AlicePopover** | `placement`, `mobileFullscreen`, `closeOnClick` | Advanced context popup. |
| **AliceTooltip** | `content`, `placement`, `delay` | Floating micro-info. |
| **AliceEmpty** | `title`, `description`, `icon`, `compact` | Placeholder for empty data states. |
| **AliceUnauthorized** | `title`, `message` | Error state for permission issues. |
| **AliceNote** | `variant` (info/warning), `title`, `message` | Inline alert block. |

---

## 📱 5. Adaptive Strategy (Mobile)

Alice UI is built with a **Mobile-First** mentality.
- **Overlays**: Complex overlays (Popovers/Drawers) should use the `mobileFullscreen` prop to fill the screen on small devices.
- **Grids**: Always specify `smCols` and `lgCols` in `AliceGrid` to prevent layout collapse.
- **Typography**: `AliceText` automatically adjusts scales based on breakpoints.

---

## 🛠 6. Development Guidelines for Engineers & AI

1. **New Components**: Must reuse `alice.css` classes for consistency.
2. **Icons**: Always import from `lucide-vue-next`.
3. **Theming**: Use the `useTheme` composable to access/mutate global colors.
4. **Agility**: Avoid creating separate `.css` files for views. 95% of UI needs should be covered by library components and Tailwind modifiers.

---

## 🏗️ 7. Feature Architecture (Clean Architecture)

All business modules (Features) must follow the Clean Architecture standard to separate logic from implementation details.

### 7.1 Directory Structure
Each feature in `src/features/{feature_name}/` must follow this hierarchy:
- **`data/`**: API implementations, Repositories (Implementation), and DataSources.
- **`di/`**: Dependency Injection container (the only place where `new` is allowed).
- **`domain/`**: Pure TypeScript business rules.
  - `entities/`: Business models.
  - `usecases/`: Single-purpose action classes.
- **`presentation/`**: UI Layer (Vue components, Composables, Config).

### 7.2 Naming Conventions (Machine & Human Readable)
| Element | Convention | Example |
| :--- | :--- | :--- |
| Feature Directory | `snake_case` | `inventory_management/` |
| Vue Component | `PascalCase` | `ProductDialog.vue` |
| Composable | `camelCase` (use prefix) | `useProducts.ts` |
| UseCase Class | `PascalCase` + `UseCase` | `GetProductsUseCase` |
| Repository Impl | `{Name}RepositoryImpl` | `ProductsRepositoryImpl.ts` |
| DataSource | `{Name}RemoteDataSource` | `ProductsRemoteDataSource.ts` |

### 7.3 Golden Rules of Architecture
1. **Dependency Inversion**: UI depends on contracts (Interfaces), not concrete implementations.
2. **Pure Domain**: No Vue or 3rd party library imports in `domain/`.
3. **Data Mapping**: All API DTOs must be mapped to Domain Entities before leaving the `data/` layer.
4. **Logic Location**: Reactive state (`ref`, `computed`) lives in **Composables**, never directly in Views.
