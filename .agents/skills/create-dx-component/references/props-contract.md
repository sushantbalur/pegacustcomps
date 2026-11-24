# Custom Component Types and the Props Contract

> Part of the [create-dx-component skill](../SKILL.md). PCore/PConnect signatures are in the [API catalog](./pcore-pconnect-apis.md).

A Constellation custom component is a React function component wrapped with `withConfiguration` from `@pega/cosmos-react-core`. At runtime Constellation renders it with a **props object** built from three sources:

1. The values of the properties declared in the component's `config.json` (`properties[].name`), resolved for the current case, page or view.
2. Standard field props that Constellation adds for field components (`value`, `required`, `readOnly`, `validatemessage`, ...).
3. `getPConnect`, a function that returns the component's `PConnect` object. This is the entry point to the PConnect and (through the global `PCore`) PCore APIs documented in this skills folder.

Stories and tests build the same props object by hand (see [test-pattern.md](./test-pattern.md)).

## Choosing the component type

| You want to...                                                                    | Type and subtype                                      | Gets `getPConnect` | Gets `children` |
| --------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------ | --------------- |
| Edit or display a single property value in a new way                              | `Field` + the matching data subtype                   | yes                | no              |
| Arrange the fields of a form or details view (columns, groups, sections)          | `Template` + `FORM` or `DETAILS`                      | yes                | yes             |
| Arrange fields in named regions the designer fills in                             | `Template` + `FORM-region` or `DETAILS-region`        | yes                | yes (per region) |
| Lay out a whole page from regions                                                 | `Template` + `PAGE`                                   | yes                | yes             |
| Add a self-contained panel that loads its own data (a list, a chart, a summary)   | `Widget` + `PAGE` (a page) or `CASE` (a case view)    | yes                | no              |
| Replace how a case view is rendered from data passed in as props                  | `Presentation` + `CASEVIEW` or `WSSCASEVIEW`          | no                 | no              |

Pick the **subtype that matches the property's data type** for a field (`Integer`, `Date`, `Picklist`, `Boolean`, ...). The scaffold for that subtype already handles the display modes and value types that data type needs.

## Props common to every component with `getPConnect`

```typescript
import type { PConnect } from '@pega/pcore-pconnect-typedefs';

interface PConnProps {
  getPConnect: () => typeof PConnect; // always present at runtime
}
```

The scaffolded `PConnProps.d.ts` (in `src/components/shared/` in library mode) defines `PConnProps` and `PConnFieldProps`. Extend `PConnFieldProps` with the extra props your `config.json` declares.

## Field components

`PConnFieldProps` provides:

| Prop                                    | Meaning                                                                                                   |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `value`                                 | Current value of the bound property                                                                       |
| `label`, `hideLabel`, `helperText`      | Label text, whether to hide it visually, and help text                                                    |
| `placeholder`                           | Placeholder text                                                                                          |
| `required`, `disabled`, `readOnly`      | Edit state. These can arrive as strings (`'true'`), so normalize them, as the scaffolds do                |
| `validatemessage`                       | Validation error text. A non-empty string means the field is in error                                     |
| `status`                                | Optional status string (for example `'error'`, `'success'`, `'pending'`)                                  |
| `displayMode`                           | How to render: editable when empty, or read-only variants (see below)                                     |
| `testId`                                | Value for `data-testid` / the design-system `testId` prop                                                 |
| `additionalProps`, `fieldMetadata`      | Extra metadata passed by the platform (shape depends on the subtype)                                      |

### Display modes

The scaffolded fields branch on `displayMode`:

- `'DISPLAY_ONLY'`: render just the value, no label or input.
- anything else (including empty): render the editable control.

Always handle `DISPLAY_ONLY`. A field that only renders an input looks broken in details views and tables. Older view metadata and the authoring preview can still pass `'LABELS_LEFT'` (a label/value pair); the runtime itself only distinguishes `DISPLAY_ONLY`, and the scaffolds no longer branch on `LABELS_LEFT` or `'STACKED_LARGE_VAL'`.

### Reading and writing the value

```typescript
const pConn = getPConnect();
const actions = pConn.getActionsApi();
const stateProps = pConn.getStateProps() as { value: string }; // e.g. { value: '.FirstName' }
const propName = stateProps.value; // the property reference to write to

// while the user types: update the value in the store
actions.updateFieldValue(propName, newValue);
// when the user leaves the field (blur) or picks an option: commit and trigger dependent logic
actions.triggerFieldChange(propName, newValue);
```

The convention used by every scaffolded field: call `updateFieldValue` on change, `triggerFieldChange` on blur, and both on change for controls with no blur moment (selects, checkboxes, radio buttons). Signatures are in [pconnect-actions-api.md](../../references/pconnect-actions-api.md).

Read-only data and expressions use `getStateProps()`; see [pconnect-state-config.md](../../references/pconnect-state-config.md).

### Validation and error messages

- Show `validatemessage` when it is a non-empty string (the scaffolds set the design-system field `status` to `'error'` and pass the message as `info`).
- Client-side validation: `pConn.getValidationApi().validate(...)` (see [pconnect-validation-api.md](../../references/pconnect-validation-api.md)); clear a message with `pConn.clearErrorMessages({ property })` (see [pconnect-misc-suggestions-creation.md](../../references/pconnect-misc-suggestions-creation.md)).

## Template components (FORM, DETAILS, PAGE)

Templates receive `children`: React elements for the child components in the template's regions. Render them where they belong in your layout instead of recreating them.

```typescript
const { children = [], NumCols = '1', label, showLabel, getPConnect } = props;
const inherited = getPConnect().getInheritedProps(); // props inherited from the parent view (readOnly, displayMode, ...)
```

- `children` can be a single element, an array or nested arrays. Normalize with `[props.children].flat(Infinity).filter(isValidElement)` when you need to inspect them, and guard against an empty or undefined value.
- `FORM` and `DETAILS` templates lay out `children` in a grid with a configurable number of columns (`NumCols`).
- `*-region` templates declare named regions in `config.json` (`A`, `B`, ... with format `CONTENTPICKER`); `children` has one entry per region.
- `DETAILS` marks child fields read-only through `child.props.getPConnect().setInheritedProp('readOnly', true)` and `setInheritedProp('displayMode', 'DISPLAY_ONLY')`.
- Inherited-prop methods are in [pconnect-state-config.md](../../references/pconnect-state-config.md); child components and `createComponent` are in [pconnect-reference-context-component.md](../../references/pconnect-reference-context-component.md) and [pconnect-misc-suggestions-creation.md](../../references/pconnect-misc-suggestions-creation.md).

## Widget components

A widget owns its data. The scaffolds fetch data in `useEffect` through `PCore` and render it with design-system components:

```typescript
const pConn = getPConnect();
const context = pConn.getContextName();
const caseID = pConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID, '');

PCore.getDataApiUtils()
  .getData('D_pyWorkHistory', { dataViewParameters: { CaseInstanceKey: caseID } }, context)
  .then((response) => { /* map response.data.data to rows */ });
```

`PCore.getConstants()` is documented in [pcore-misc-utilities.md](../../references/pcore-misc-utilities.md). Rules for widgets: track a loading state, handle `response.data.data === null`, handle rejection, and re-fetch only when the inputs (`context`, `caseID`) change. See [pcore-rest-data-details.md](../../references/pcore-rest-data-details.md) and the [error handling](../../best-practices/error-handling-and-resiliency.md) and [performance](../../best-practices/performance-and-efficiency.md) guides.

Use `pConn.getLocalizationService().getLocalizedText('...')` for user-visible strings (see [pconnect-case-info-data-info-localization.md](../../references/pconnect-case-info-data-info-localization.md)). Widget scaffolds include a `localizations.json` file for translations.

## Presentation components

`CASEVIEW` and `WSSCASEVIEW` components do not use `getPConnect` or `PCore`. They receive everything as props whose type comes from the design system (`CaseViewProps` from `@pega/cosmos-react-work`, or from `@pega/cosmos-react-wss` for `WSSCASEVIEW`). Implement the rendering only; the type tells you which props exist.

## Rules that apply to every type

1. Export the component as `export default withConfiguration(MyComponent)`.
2. Keep `import '../shared/create-nonce';` in `index.tsx` (Presentation scaffolds do not include it). It sets the webpack nonce for styles.
3. Render through the design-system (`@pega/cosmos-react-core`, `-work`, `-wss`) components. They provide accessibility and theming. Wrap the output in the scaffolded `styled-components` wrapper from `styles.ts`.
4. Every prop you read must be declared in the props interface **and** exist as a `config.json` property (or be a standard prop above). See [config-schema.md](./config-schema.md).
5. Do not use PCore or PConnect members that are not documented in this folder. Treat them as unsupported.
6. Do not read or write the DOM or `window` for application data. Use the PCore and PConnect APIs.

## `index.tsx` file rules

### Required shape


```typescript
import { Input, withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from '../shared/PConnProps';
import '../shared/create-nonce';
import handleEvent from './event-utils';
import StyledWrapper from './styles';

interface Props extends PConnFieldProps {
  // one entry per extra property in config.json, all optional
}

function AcmeLibComponentName(props: Props) { ... }

export default withConfiguration(AcmeLibComponentName);
```

- The inner function name is `AcmeLib<ComponentName>` — PascalCase, matching `config.json` `name` with underscores removed.
- `import '../shared/create-nonce';` is side-effect only (the scaffold generates it in `src/components/shared/`). Never remove it, never bind it to a variable.
- Always default-export through `withConfiguration()`.
- `Props` extends `PConnFieldProps`; every added prop is optional and mirrors a `config.json` property name exactly.
- Never edit `PConnProps.d.ts`, `create-nonce.ts`, or `event-utils.ts` — they are contract files.

### Cosmos-first in this file


The canonical rule lives in [AGENTS.md](../../../../AGENTS.md) and loads on every request. What it means *in this file*: the component's rendered tree must be Cosmos components. `StyledWrapper` from `./styles` is a positioning shell, not a layout system — put `Flex`/`Grid` inside it, not `<div className='row'>`.

**Never use inline `style={{ ... }}` here.** Custom CSS belongs in `styles.ts`.

**Verify every Cosmos prop you have not used before** by reading `node_modules/@pega/cosmos-react-core/lib/components/<Name>/<Name>.d.ts`. Prop names here are often not what they sound like — `Banner` needs an array, `EmptyState` uses `message` not `title`, `Tag` needs `children` not `label`, and `Divider` / `Badge` / `IconButton` / `Tab` do not exist. The known traps are in [cosmos-components.md](../../../../.claude/skills/create-dx-component/references/cosmos-components.md).

To read a Cosmos theme value, call `useTheme()` in this file and pass the value into the styled component as a prop — the theme does not reach `styles.ts` on its own.

### Lint constraints that bite here


- `no-console` — no `console.*`
- `no-plusplus` — use `+= 1`
- `no-nested-ternary`, `no-lonely-if`
- `func-names` — no anonymous function expressions
- `radix` — `parseInt(x, 10)`
- `react/no-array-index-key` — use a stable key, not the index
- `react/button-has-type` — every `<button>` needs an explicit `type`
- `@typescript-eslint/no-unused-vars` — every import, variable, state value, helper, and interface field must be referenced. Delete anything that is not.

`any` and `@ts-ignore` are permitted. `PCore` is a global — do not import it.
