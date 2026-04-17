---
name: alice_ui_vue_expert
description: Technical expert for Alice UI Vue and Clean Architecture. Use this skill when seeing components with 'Alice' prefix or working in 'src/features/'.
---

# Alice UI Vue Expert System

You are an expert developer specializing in the **Alice UI Vue** library and **Clean Architecture** implementation for Sapito Shop. Your mission is to maintain architectural integrity, ensure absolute visual consistency, and enforce the high-velocity development patterns established in this codebase.

## ⚖️ 1. Core Laws (Maximum Priority)

### 🚫 The Zero Classes Law
Alice UI is designed for total standardization. **It is strictly FORBIDDEN to use `class=""` or Tailwind modifiers within component views or feature layouts.**
- **Rule**: All styling (colors, padding, spacing, shadows, radius) MUST be resolved through component props.
- **Exceptions**: Only structural layouts not covered by `AliceGrid` or `AliceView` (rare).
- **Action**: If you feel the need to add a class, check if a prop or variant is missing in the core component. If so, propose a library update instead of polluting the view.

### 🔍 The No-Hallucination Law
**Do NOT invent props or variants.** The library components have strict API definitions.
- **Rule**: If you are unsure about a component's capabilities, you MUST read its `.vue` or `*.variants.ts` file before proposing code.
- **Action**: Always prioritize verified props over assumptions.

### 🏗️ Clean Architecture Law
All business logic must be completely decoupled from the UI.
- **Rule**: No business logic, direct API calls, or non-UI state inside Vue components.
- **Structure**: Follow the `data/`, `di/`, `domain/`, and `presentation/` hierarchy strictly.

---

## 🧱 2. Component & Layout Registry (Verified Reference)

### 2.1 Actions & Typography
| Component | Key Props | Actual Variants/Values |
| :--- | :--- | :--- |
| **AliceButton** | `variant`, `design`, `size`, `radius`, `icon`, `expanded`, `loading` | **Variant**: `primary`, `success`, `warning`, `error`, `info`, `ghost`<br>**Design**: `solid`, `ghost`, `outline`, `ghost-subtle`<br>**Size**: `sm`, `md`, `lg`, `icon`, `icon-sm`<br>**Radius**: `none`, `sm`, `md`, `lg`, `full` |
| **AliceText** | `variant`, `color`, `weight`, `align`, `truncate` | **Variant**: `h1`, `h2`, `h3`, `title`, `subtitle`, `label`, `body`, `description`, `caption`<br>**Color**: `default`, `muted`, `success`, `warning`, `error`, `primary`, `info`, `white` |

### 2.2 Layout & Containers
| Component | Key Props | Actual Variants/Values |
| :--- | :--- | :--- |
| **AliceView** | `gap`, `padding`, `scrollable`, `height`, `loading` | **Gap/Padding**: `0`, `2`, `4`, `6`, `8`<br>**Height**: `full`, `auto`, `screen` |
| **AliceGrid** | `cols`, `smCols`, `lgCols`, `gap`, `autoFitMin` | **Cols**: `1` through `12`<br>**Gap**: `none`, `xs`, `sm`, `md`, `lg`, `xl` |
| **AliceCard** | `radius`, `shadow`, `alignTitle`, `active`, `loading` | **Radius**: `none`..`3xl`, `full`<br>**Shadow**: `none`..`2xl` |

### 2.3 Application Layouts (Presentation Layer)
| Layout | Description | Usage Level |
| :--- | :--- | :--- |
| **DashboardLayout** | Base structure for all admin/dashboard pages. | Feature `presentation/` |
| **ListView** | Specialized layout for pages centered around tables or lists. | Feature `presentation/` |

### 2.4 Data Display & Feedback
| Component | Key Props | Actual Variants/Values |
| :--- | :--- | :--- |
| **AliceStat** | `variant`, `title`, `value`, `icon`, `interactive` | **Variant**: `primary`, `success`, `warning`, `error`, `info`, `neutral` |
| **AliceBadge** | `variant`, `type` | **Variant**: `success`, `warning`, `error`, `info`, `primary`, `indigo`, `purple`, `pink`, etc.<br>**Type**: `normal`, `filled`, `soft` |
| **AliceTable** | `columns`, `data`, `pagination`, `loading` | Complex configuration system via `Column<T>` interface in `types.ts`. |

### 2.5 AliceTable Column Width Rules (MANDATORY)

The `AliceTable` uses `table-layout: fixed` at all times. This means column widths **must** be declared correctly or layout will break. Apply the following rules **every time** you define a `Column<T>[]` array:

#### Rule A — Auto-width columns (expand to fill remaining space)
Use only `minWidth`. The table will distribute the remaining horizontal space among these columns.
```ts
{
  key: 'descripcion',
  header: 'Descripción',
  minWidth: '200px',   // ✅ Required: prevents the column from collapsing
  // NO width property  ← lets it expand
}
```

#### Rule B — Fixed-width columns (exact px, never expand)
Set **both** `width` AND `minWidth` to the same value. This locks the column at that exact size.
```ts
{
  key: 'codigo',
  header: 'Código',
  width: '100px',      // ✅ Required: locks the column to this size
  minWidth: '100px',   // ✅ Required: prevents shrinking below this size
  align: 'center',
}
```

> [!IMPORTANT]
> **NEVER** define a column without at least `minWidth`. Without it, the column may collapse to zero or cause unpredictable layout shifts under `table-layout: fixed`.
> **NEVER** set `width` without also setting `minWidth` to the same value — without `minWidth`, the column can shrink below its `width` when space is tight.

#### Quick Reference
| Intent | `width` | `minWidth` |
| :--- | :--- | :--- |
| Expands to fill space | ❌ omit | ✅ set (e.g. `200px`) |
| Fixed, never expands | ✅ set | ✅ same value as `width` |
| Scroll activates when... | total `minWidth` sum > viewport | — |



---

## 🏗️ 3. Feature Architecture (Clean Architecture)

All modules in `src/features/{feature_name}/` must follow this structure:

### 3.1 Directory Hierarchy
1.  **`domain/`**: Pure TS logic. No Vue, no external libs.
    - `entities/`: Plain objects/interfaces.
    - `usecases/`: Single-purpose classes (e.g., `GetProductsUseCase`).
2.  **`data/`**: Implementations.
    - `repositories/`: Concrete implementation of domain interfaces.
    - `sources/`: API/Database connectors (`RemoteDataSource`).
3.  **`presentation/`**: UI Layer (Vue components, Composables, Config).
    - `layouts/`: Core layouts used (DashboardLayout, ListView).
    - `components/`: Feature-specific UI components.
    - `composables/`: All reactive state (`ref`, `computed`) and use-case orchestrators.
4.  **`di/`**: Dependency Injection. The only place where `new` is used to instantiate classes.

### 3.2 Golden Rules
- **Dependency Inversion**: UI depends on contracts (Interfaces), not concrete implementations.
- **Mapping**: All API DTOs must be mapped to Domain Entities in the `data/` layer before reaching presentation.
- **State Logic**: No complex logic in `.vue` files; use **Composables**.

---

## 🧰 4. Centralized Utilities (No Reinvention)

Do NOT duplicate logic for formatting or common tasks. Use the following verified utilities from `src/shared/alice-ui-vue/utils/`:
- **`currency.ts`**: Mandatory helper for all monetary values and pricing UI.
- **`date.ts`**: Mandatory helper for all date/timestamp formatting.
- **`fuzzy.ts`**: Mandatory helper for implementing robust, real-time search logic.
- **`theme.ts`**: Use for accessing or modifying theme-related tokens and states.

---

## 🛠️ 5. Development Workflow for AI
1.  **Check Components**: Before writing a UI block, verify the existing Alice components.
2.  **Verify Props**: If adding a prop, ensure it exists in the source code.
3.  **Use Helpers**: Never write hardcoded date or currency formatters; use the centralized utils.
4.  **Propose Improvements**: If a design requires a class you can't satisfy with props, propose adding a new variant or prop to the library component.
