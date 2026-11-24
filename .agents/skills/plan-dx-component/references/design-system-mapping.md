# Mapping Another Design System to Cosmos

Cosmos is `@pega/cosmos-react-core` (plus `@pega/cosmos-react-work` and `@pega/cosmos-react-wss`). The names below were checked against the installed `@pega/cosmos-react-core`. Component and prop names differ between Cosmos versions, so read the `.d.ts` in `node_modules/@pega/cosmos-react-core/lib/components/<Name>/` before using one. Several names that other libraries use do not exist in Cosmos: `Divider`, `Badge`, `Chip`, `Accordion`, `Stepper`, `DataGrid`, `IconButton` and `Snackbar`.

## Inputs

| Source concept | Cosmos |
| --- | --- |
| Text field | `Input` |
| Multi-line text | `TextArea` |
| Search box | `SearchInput` |
| Number, currency | `NumberInput`, `CurrencyInput` |
| Date, date and time, time | `DateInput`, `DateTimeInput`, `TimeInput` |
| Phone | `PhoneInput` |
| Select, dropdown | `Select` |
| Autocomplete, combo box | `ComboBox` |
| Checkbox, checkbox group | `Checkbox`, `CheckboxGroup` |
| Radio group | `RadioButtonGroup` |
| Toggle, switch | `Switch` |
| Slider | `Slider` |
| Rating | `Rating` (read-only display in the build checked; build the editable control from a radio group) |
| Color picker | `ColorPicker` |
| Form, field wrapper, label | `Form`, `FormField`, `FormControl` |

## Layout and structure

| Source concept | Cosmos |
| --- | --- |
| Box, Stack, Row, Column | `Flex` |
| Grid, layout columns | `Grid` |
| Card, Paper, Panel | `Card` (with its header and content parts) |
| Accordion, Collapse | `ExpandCollapse`, or `FieldGroup` with `collapsed` |
| Tabs | `Tabs` with `TabPanel` |
| Stepper, Wizard | `MultiStepForm` |
| Divider | None. Use `Grid` or `Flex` gap, or a `Card` border |
| Typography | `Text` with its variants |
| Link | `Link` |
| Image, Lightbox | `Image`, `Lightbox` |
| Label and value lists | `FieldValueList`, `SummaryList`, `MetaList` |

## Actions and overlays

| Source concept | Cosmos |
| --- | --- |
| Button | `Button` (danger: `DangerButton`; menu: `MenuButton`) |
| Menu | `Menu`, `MenuButton` |
| Dialog, Modal | `Modal` |
| Drawer, side sheet | `Drawer` |
| Popover | `Popover` |
| Tooltip | `Tooltip` |

## Feedback and data

| Source concept | Cosmos |
| --- | --- |
| Alert, inline message | `Banner` (its `messages` is an array) |
| Toast, transient message | `Toaster` |
| Spinner, progress | `Progress` |
| Empty and error screens | `EmptyState`, `ErrorState` |
| Table, data grid | `Table` |
| Pagination | `Pagination` |
| Tree | `Tree` |
| Avatar | `Avatar` |
| Badge, chip, pill, counter | `Tag`, `Status` (variants `success`, `urgent`, `warn`, `pending`, `info`), `Count` |
| Breadcrumbs | `Breadcrumbs` |

## Vocabulary from other libraries

Names differ between libraries. Use this to translate, then read the Cosmos `.d.ts` for the real props. Library names and their components change over time; if a source component is not here, find what it does and map that.

| Source concept (typical names) | Cosmos |
| --- | --- |
| Dialog, Modal, Sheet, Offcanvas | `Modal` (centered), `Drawer` (side) |
| Toast, Snackbar, Notification, Message | `Toaster` |
| Alert, MessageBar, InlineNotification | `Banner` |
| Badge, Chip, Tag, Pill, Lozenge | `Tag`, `Status`, `Count` |
| Accordion, Collapse, Disclosure | `ExpandCollapse`, or `FieldGroup` with `collapsed` |
| Command, Autocomplete, Combobox | `ComboBox` |
| Dropdown menu, Context menu | `Menu`, `MenuButton` |
| Calendar, DatePicker | `DateInput`, `DateTimeInput` |
| Data table, DataGrid, DataTable | `Table` |
| Steps, Stepper, Wizard, Progress tracker | `MultiStepForm` |
| Toggle, Switch | `Switch` |
| Radio group | `RadioButtonGroup` |
| Form item, Field, FormControl, Label | `FormField`, `FormControl` |
| Persona, Avatar | `Avatar` |
| Spinner, Loader, Progress bar | `Progress` |
| Skeleton, Placeholder | `Progress`; check the installed version for a skeleton component |

Two translation rules for generated or utility-styled code:

- **Utility classes and style props** (a class list, a `sx` or `style` prop, a theme provider) are not carried over. Use Cosmos props, and `styles.ts` only where Cosmos cannot express it.
- **Headless primitives** (unstyled building blocks you assemble yourself) become a single whole Cosmos component. Do not rebuild a primitive from raw elements.

## Not in Cosmos

For each of these, first check whether the browser or a Cosmos composition does the job. If not, propose the library to the user with the reasons and costs, and wait for consent.

- Charts, maps, org charts, drag-and-drop, virtualized lists.
- Rich text editing. The platform's rich text uses a separate package, `@pega/cosmos-react-rte`; check that it is installed and approved before using it, and never render stored HTML with `dangerouslySetInnerHTML`.
- Date range pickers, color-scheme or theme switchers, animation libraries.

## Differences to tell the user about

- **Theme.** Cosmos draws from the Pega theme. A component keeps the look of the application it runs in, and will not match the source library's colors, spacing or typography.
- **Props differ.** Cosmos props are often named differently (`EmptyState` takes `message`, `Banner` takes an array). Expect to re-read the types, not to rename props one for one.
- **Accessibility.** Cosmos components carry their own roles and keyboard behavior. A foreign component you keep must be re-checked, because the platform does not make it accessible for you.
- **Styles.** A library that injects styles at runtime needs the CSP nonce to work in the Pega page (see `create-nonce` in the scaffold).
