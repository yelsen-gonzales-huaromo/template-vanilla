# Components

Each component lives in its own folder with three files:

```
components/ui/<name>/
├─ <name>.js     Render function (factory) — pure, no side effects beyond DOM.
├─ <name>.css    Scoped styles, opt-in via styles/components/index.css.
└─ <name>.html   Reference markup for designers / Storybook-like docs.
```

All factories accept a single options object and return a `Node`. They never
mutate global state and never call frameworks. Use the `h()` hyperscript helper
from `utils/helpers/dom.js` to keep templates declarative.

## Component catalog

### UI primitives

| Component   | Purpose                                | Variants / Sizes                    |
|-------------|----------------------------------------|-------------------------------------|
| `Button`    | Action trigger                          | primary, secondary, ghost, outline, danger, success · sm/md/lg |
| `Input`     | Text input                              | sm/md/lg, invalid                   |
| `Textarea`  | Multiline input                         | —                                   |
| `Select`    | Native select with token-aware caret    | —                                   |
| `Card`      | Container with optional header/footer   | flat, elevated                      |
| `Badge`     | Status / counter pill                   | primary, success, warning, danger, info, outline, dot |
| `Avatar`    | Initials or image                       | sm/md/lg/xl                         |
| `Spinner`   | Loading indicator                       | sm/md/lg + overlay                  |
| `Skeleton`  | Loading placeholder                     | text, title, circle, card           |
| `Modal`     | Imperative dialog with focus trap       | sm/md/lg/xl                         |
| `Dropdown`  | Click-trigger menu                      | —                                   |
| `Table`     | Declarative data table                  | striped, compact                    |
| `Pagination`| Page list with ellipses                 | —                                   |
| `Tooltip`   | Hover/focus tooltip                     | —                                   |
| `EmptyState`| Empty/error state                       | —                                   |
| `Toast`     | Notifications via `notificationsStore`  | success, error, warning, info       |

### Forms

`FormField` composes a label + control + hint + error and wires `for`,
`aria-describedby`, and `aria-invalid` automatically. Always wrap controls
in `FormField` instead of writing your own labels.

### Common

| Component         | Purpose                                                |
|-------------------|--------------------------------------------------------|
| `ErrorBoundary`   | Catches synchronous render errors, shows fallback.     |
| `LazyLoader`      | Resolves `() => import(...)` with placeholder.         |
| `PageTitle`       | Heading + subtitle + actions row, used per page.       |
| `ProtectedRoute`  | Renders children only if the user has the role/perm.   |

## Adding a new component

1. Create `src/components/ui/<name>/<name>.{js,css,html}`.
2. Import its CSS from `src/styles/components/index.css`.
3. Re-export from `src/components/index.js`.
4. Document props in this file.
