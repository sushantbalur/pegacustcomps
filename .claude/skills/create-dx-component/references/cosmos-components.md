# Cosmos React Core - Available Components

Every name below was checked against the barrel in `node_modules/@pega/cosmos-react-core/lib/index.d.ts`. **Verify any name that is not on this list before you import it** — several plausible-sounding components (`Divider`, `Badge`, `DataGrid`, `IconButton`, `Tab`) do **not** exist.

## Layout Components
- `Grid` — CSS Grid layout container
- `Flex` — Flexbox layout container
- `Card` — Card container with shadow/border
- `CardHeader` — Card header section
- `CardContent` — Card content section
- `FieldGroup` — Group of fields with optional label
- `FormField` — Label + control + info + actions wrapper

## Input Components
- `Input` — Text input field
- `TextArea` — Multi-line text input
- `Checkbox` — Single checkbox
- `CheckboxGroup` — Group of checkboxes
- `RadioButtonGroup` — Radio button selection
- `Select` — Dropdown select
- `DateInput` — Date picker input
- `TimeInput` — Time picker input
- `NumberInput` — Numeric input
- `CurrencyInput` — Currency input with formatting
- `PhoneInput` — Phone number input
- `SearchInput` — Search input with icon

## Display Components
- `Text` — Typography component (variants: h1-h6, body, caption)
- `FieldValueList` — Label-value pair display (variants: inline, stacked)
- `BooleanDisplay` — True/false display
- `DateTimeDisplay` — Formatted date/time
- `CurrencyDisplay` — Formatted currency
- `PhoneDisplay` — Formatted phone number
- `EmailDisplay` — Email with link
- `URLDisplay` — URL with link
- `Icon` — SVG icon display
- `Avatar` — User avatar
- `Progress` — Progress bar/indicator
- `EmptyState` — Empty view placeholder

## Badges (all from `./components/Badges`)
- `Status` — Status badge/indicator
- `Tag` — Label chip
- `Count` — Numeric badge
- `Alert` — Alert badge
- `Selectable`, `Keyboard`

## Data Components
- `Table` — Data table with columns, sorting, pagination

## Feedback Components
- `Banner` — Banner notification
- `Toaster` — Toast notifications
- `Modal` — Modal dialog (see gotchas)
- `FormDialog` / `InfoDialog` — Anchored dialogs

## Navigation Components
- `Link` — Hyperlink
- `Button` — Action button
- `Tabs` — Tabbed navigation (**not** `Tab`)

## HOCs & Utilities
- `withConfiguration` — **Required wrapper** for all DX components
- `ShortcutManager` — Keyboard shortcut handling
- `PopoverManager` — Popover positioning
- `ModalManager` — Modal dialog management
- `useTheme` — Cosmos theme access (see gotchas)
- `useModalManager` — Imperative modal creation

## Additional components used by Pega's own widgets and templates

These are exported by `@pega/cosmos-react-core` (or `@pega/cosmos-react-work` where noted) in recent builds. Check the export and prop names in the installed `.d.ts` before use; several came from a newer Cosmos than a customer project may have.

| Need | Component or helper | Notes |
| --- | --- | --- |
| Summary list with loading, count, per-item actions and focus after delete | `SummaryList`, `ViewAll` | `loading`, `count` (pass `undefined` while loading), `noItemsText`, `onViewAll`, item `contextualLabel`, and `deletedItemId` + `onDeleteFocusComplete` + `fallbackFocusRef` |
| Error with retry | `ErrorState` | props are `message` and `onRetry` only; its retry button reads "Try again" |
| Destructive confirm | `Modal`, `DangerButton`, `useModalManager`, `useModalContext` | see [widget-patterns.md](./widget-patterns.md) |
| Focus an error summary | `Banner` with a `handle` | `handle.current.focus()`; `messages` must be an array |
| Progress placement | `Progress` | `placement` is `'block'`, `'local'` (needs a positioned parent) or `'inline'`; `variant` is `'ring'`, `'bar'` or `'ellipsis'` |
| Grouped fields | `FieldGroup`, `FieldGroupList` | `fieldset`/`legend`; `collapsed`, `status='error'`, `headingTag` |
| Tabs | `Tabs`, `TabPanel` | ARIA and arrow keys are built in; do not reimplement |
| Page layouts | `OneColumnPage`, `TwoColumnPage`, `ThreeColumnPage`, `NarrowWidePage`, `WideNarrowPage`, `TabbedPage` | slots `a`, `b`, `c`; they own scrolling and heading focus |
| Read-only label/value lists | `FieldValueList`; `Details`, `DetailsList`, `DetailsContext` from `@pega/cosmos-react-work` | `Details` handles column fitting and label alignment |
| Display formatting | `DateTimeDisplay`, `CurrencyDisplay`, `NumberDisplay`, `EmailDisplay`, `PhoneDisplay`, `BooleanDisplay`, `ParagraphDisplay`, `URLDisplay`, `NoValue` | prefer to hand formatting |
| Utilities | `useBreakpoint`, `useTheme`, `useConfiguration`, `createUID`, `debounce`, `createStringMatcher`, `formatNumber`, `useElement`, `LocaleOverride`, `getPhoneNumberParts` | create a `debounce` once (`useMemo`), never in the render body |
| Safe links | `disallowedURI` | present in some builds; keep your own protocol allow-list as well |

## Verified Gotchas

Each of these was confirmed by reading the installed package. They are the opposite of what the prop names suggest.

| Component | Trap |
| --- | --- |
| `Banner` | `messages` must be an **array**. Passing a string throws `messages.flatMap is not a function`. |
| `EmptyState` | The prop is `message`, **not** `title`. A `title` prop is silently ignored. |
| `Tag` | Requires `children`. There is **no** `label` prop. |
| `Input` | Does **not** render a character counter. `maxLength` only sets the native attribute. Only `TextArea` has `displayCharCount`. |
| `Input` | Renders its own `FormField` when `label` is passed. Composing it inside your own `FormField` while also passing `label` nests two of them. |
| `FormField` | `onClear` is gated behind `isRadioCheck` — it renders **only** for radio/checkbox groups. For a text input, use the `actions` array. |
| `FormField` / `Input` | Pass the **same explicit `id`** to both, or the label's `htmlFor` will point at a different generated id. |
| `Modal` | Needs a `ModalManager` ancestor. Without one, `useModalManager().create()` is a silent no-op and `dismiss` does nothing. |
| — | There is **no floating-label** API anywhere in Cosmos. Build it in `styles.ts`. |

### styled-components theme does not cross the boundary

`@pega/cosmos-react-core` bundles its **own nested copy** of `styled-components`. Its `ThemeProvider` therefore does not populate the `ThemeContext` used by a component's own `styles.ts`, and `theme.base` is `undefined` there.

Read the theme in `index.tsx` and pass the values down as props:

```typescript
import { useTheme } from '@pega/cosmos-react-core';

const palette = useTheme().base.palette;
// palette['primary-background'] | palette['foreground-color'] | palette.urgent | palette.success
<StyledWrapper $error={palette.urgent} />
```

## Import Pattern
```typescript
import {
  Grid,
  Flex,
  Card,
  CardContent,
  Text,
  Input,
  Table,
  withConfiguration
} from '@pega/cosmos-react-core';
```

## Additional Cosmos Libraries
- `@pega/cosmos-react-work` — Work-related components (assignments, cases)
- `@pega/cosmos-react-wss` — Workspace components
- `@pega/cosmos-react-condition-builder` — Condition/filter builder
