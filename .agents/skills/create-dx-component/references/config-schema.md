# Config.json Schema Reference

The `config.json` file defines component metadata and configurable properties that appear in the Pega Constellation authoring environment.

## Base Structure

```json
{
  "name": "<Org>_<Library>_ComponentName",
  "label": "Human Readable Label",
  "description": "Brief description of the component",
  "organization": "<Org>",
  "version": "1.0.0",
  "library": "<Library>",
  "componentKey": "<Org>_<Library>_ComponentName",
  "type": "Field|Template|Widget|Presentation",
  "subtype": "Text|Boolean|FORM|DETAILS|CASE|PAGE|CASEVIEW",
  "subtypeLabel": "Human readable subtype",
  "icon": "optional-icon.svg",
  "properties": [],
  "defaultConfig": {}
}
```

## Type-Specific Configurations

### Field Component
```json
{
  "type": "Field",
  "subtype": "Text",
  "subtypeLabel": "Text",
  "properties": [
    { "name": "label", "label": "Field label", "format": "TEXT" },
    { "name": "hideLabel", "label": "Hide Label", "format": "BOOLEAN" },
    { "name": "readOnly", "label": "Edit mode", "format": "READONLY" },
    {
      "label": "Input settings",
      "format": "GROUP",
      "visibility": "(!readOnly = true)",
      "properties": [
        { "name": "helperText", "label": "Helper text", "format": "TEXT" },
        { "name": "placeholder", "label": "Placeholder", "format": "TEXT" }
      ]
    },
    {
      "label": "Conditions",
      "format": "GROUP",
      "properties": [
        { "name": "required", "label": "Required", "format": "REQUIRED", "visibility": "(!readOnly = true)" },
        { "name": "disabled", "label": "Disabled", "format": "DISABLED" },
        { "name": "visibility", "label": "Visibility", "format": "VISIBILITY" }
      ]
    },
    {
      "label": "Advanced",
      "format": "GROUP",
      "collapsible": true,
      "properties": [
        { "name": "testId", "label": "Test ID", "format": "TEXT", "includeAnnotations": false }
      ]
    }
  ]
}
```

### Template Component
```json
{
  "type": "Template",
  "subtype": "FORM",
  "subtypeLabel": "FORM",
  "properties": [
    {
      "format": "SELECT",
      "name": "NumCols",
      "label": "Number of columns",
      "defaultValue": "1",
      "source": [
        { "key": "1", "value": "One" },
        { "key": "2", "value": "Two" },
        { "key": "3", "value": "Three" }
      ]
    },
    { "format": "INSTRUCTIONS" },
    {
      "name": "Fields",
      "label": "Fields",
      "format": "CONTENTPICKER",
      "allowCreatingGroup": true
    }
  ]
}
```

### Widget Component
```json
{
  "type": "Widget",
  "subtype": "CASE",
  "subtypeLabel": "CASE",
  "properties": [
    { "name": "label", "label": "Label value", "format": "TEXT" }
  ],
  "defaultConfig": {
    "label": "@L My Widget Label"
  }
}
```

## Property Format Reference

| Format | Description | Additional Fields |
|--------|-------------|-------------------|
| `TEXT` | Free text input | — |
| `SELECT` | Dropdown | `source: [{key, value}]`, `defaultValue` |
| `BOOLEAN` | Toggle | `defaultValue: true/false` |
| `NUMBER` | Numeric | — |
| `READONLY` | Edit mode toggle | — |
| `REQUIRED` | Required toggle | — |
| `DISABLED` | Disabled toggle | — |
| `VISIBILITY` | Condition expression | — |
| `CONTENTPICKER` | Add fields/views | `addTypeList`, `allowCreatingGroup`, `saveToConfig` |
| `DATASOURCE` | Data page binding | — |
| `GROUP` | Nested property group | `properties: [...]` |
| `INSTRUCTIONS` | Help text | — |
| `VALUEINPUT` | Value with rule type | `ruleType` |

## Visibility Expressions

Properties can be conditionally shown. Forms seen in shipped configs:

- `"visibility": "(!readOnly = true)"` — a bare sibling property name with a single `=`, in parentheses
- `"visibility": "$this.columnWidth == 'custom'"` — `$this.` prefix with `==` (also `!=`, `!==`)
- `"visibility": "!($this.readOnly == true)"` — negation
- `"visibility": "hideLabel == false || hideLabel IS_NULL"` — combine with `&&` and `||`
- `"visibility": "$this.mode CONTAINS 'single'"` — `CONTAINS`, `STARTS_WITH`, `IS_NULL`, `IS_NOT_NULL`, `IS_IN_LIST`
- `"visibility": "@PLATFORMNAME != 'launchpad'"` — platform-specific; the one `@` context variable proven for custom components

Prefer `$this.<prop>` or the parenthesized bare name over a bare `$prop`; no shipped config uses `$prop`. Other `@` variables (`@VIEWTYPE`, `@VIEWTEMPLATESUBTYPE`, `@RULEVIEWTYPE`, `@ISHYBRIDAPP`, and so on) appear in Pega's own configs, but there is no evidence they are available to custom components. Do not invent a variable because its name sounds right. Compare to the correct type: do not compare a boolean to the string `'true'` unless a shipped example does.

## DefaultConfig

Use `defaultConfig` to set initial values when the component is first added:
```json
{
  "defaultConfig": {
    "label": "@L Default Label",
    "NumCols": "2"
  }
}
```

The `@L` prefix marks the value as localizable.

## What `validate-schema` checks

`npm run validate-schema -- <Org>_<Library>_<Name>` (also the first step of `buildComponent`) checks the structure of the file, **not** whether the platform understands a `format`. The rules, from the CLI validator:

- Required top-level keys: `componentKey`, `name`, `description`, `type`, `subtype`, `properties`. `label`, `icon` and `organization` are not required by the schema (library mode still enforces `organization` and `library`; see Key and property rules). Extra top-level keys are allowed.
- `name` and `componentKey` match `^[A-Za-z0-9]+_[A-Za-z0-9]+_[A-Za-z0-9]+$`.
- `description` is not blank.
- `type` is one of `Field`, `Template`, `Widget`, `Presentation`. `subtype` is one of the values in [Valid `subtype` values](#valid-subtype-values), with exact casing (for example `TimeOfDay`). The Presentation subtypes (`CASEVIEW`, `WSSCASEVIEW`) are valid only on `Presentation`, and `Presentation` accepts only those.
- `properties` is an array with **unique** entries. Each entry must match one of three shapes:
  1. `name`, `label` and `format` (the normal control).
  2. A `CASCADE`: `format`, plus a `source` object (`name`, `label`, `format`) and `cascadeElements` where each element has `key`, `name`, `label` and `format`. Only `format` is required.
  3. A `GROUP`: `label` and `format`, with a nested `properties` array whose entries are a normal control, a `LABEL` (`variant`, `label`, `format`) or an `INLINE` (`format` and `elements`, each element with `key`, `format` and `label`). `GROUP` has no `name`.
- A bare `{ "format": "INSTRUCTIONS" }` passes (through the `CASCADE` shape, which only requires `format`).

**`format` is only checked to be a string.** A misspelled or unsupported format passes `validate-schema` and `buildComponent` and then fails (or silently does nothing) in App Studio. Use only formats from the tables below, and check any other against a scaffold of the same type.

Typical errors: `Invalid: data/properties/N must have required property 'label'` (property N, zero-based, is incomplete), `data/properties must NOT have duplicate items` (two identical entries), and `Invalid: data/subtype must be equal to one of the allowed values`.

## More formats and members

**Scaffold-proven.** The CLI scaffolds use exactly these 17 formats, so they are safe for custom components: `GROUP`, `TEXT`, `SELECT`, `NUMBER`, `BOOLEAN`, `VISIBILITY`, `REQUIRED`, `DISABLED`, `READONLY`, `VALUEINPUT`, `LABEL`, `CONTENTPICKER`, `CASCADE`, `PROPERTY`, `INLINE`, `DATASOURCE`, `INSTRUCTIONS`.

| Format | Notes and members |
| --- | --- |
| `TEXT` | `helperText`, `helperTextVisibility` (same grammar as `visibility`), `placeholder`, `ignorePattern` (characters stripped from input), `includeAnnotations` (default true), `allowsDynamicText`, `multiline` |
| `NUMBER` | `min`, `max` (min defaults to 0), `showDecimal`, `numberOfDecimals`. Store a number, not a string |
| `BOOLEAN` | `defaultValue`; give it a positive label such as `Show profile` and set the default explicitly when absent and false differ |
| `SELECT` | `source: [{ key, value }]`, `defaultValue`, `placeholder`, `helperText`, `localize`. Persist the stable `key`; `value` is the display text |
| `GROUP` | Nested `properties`, `collapsible`, `defaultCollapsed`, `visibility`. A group is not a runtime property and is never serialized |
| `CONTENTPICKER` | Templates only. `addTypeList` (values seen: `Fields`, `Views`, `Widgets`, `Insights`, `Associations`), `allowCreatingGroup`, `saveToConfig`, `source`, `itemTypes` |
| `PROPERTY` | Property picker. `ofContextClass`, `filter` (for example `"$this.typeKey == 'Pega-Fields-Scalar-Integer'"`), `useAnnotation`, `inheritedProp` |
| `CASCADE` | One property controls which dependent control is shown. `source` is a full property object, `cascadeElements` each carry a `match` value, `clearElementsOnSwitch` clears hidden values on a switch |
| `LABEL`, `INLINE` | Layout in the property panel. `LABEL` takes `variant` (`primary`, `secondary`, `h1` to `h6`); `INLINE` has an `elements` array |
| `VALUEINPUT` | Value with a rule type (`ruleType`, for example `"Paragraph"`), `allowsDynamicText` |
| `DATASOURCE` | Data page binding; has a nested `properties` array of the fields to read from the source |
| `VISIBILITY`, `REQUIRED`, `DISABLED`, `READONLY` | Platform-aware condition editors, not plain booleans. `REQUIRED` and `DISABLED` also take `inheritedProp` |

**Seen in Pega's own components, support for custom components unconfirmed:** `FIELDLABELINPUT`, `EXPRESSION`, `DEFAULTVALUE`, `CASELINK`, `VIEWPICKER`, `DATAPAGE`, `PARAMETERS`, `GROUPBY`, `ACTIONPICKER`, `COLUMNFILTER`, `COLUMNSORT`, `COLUMNFORMATTER`, `FILLCOLUMNWIDTH`, `PRESETPICKER`, `CONTENTPICKERSOURCE`, `RENDERMODE`, `EDITMODE`, `MULTIRECORDDISPLAYAS`, `AUTOGENERATED`. Because `validate-schema` accepts any string, a format from this list will pass validation even if App Studio ignores it. Do not use one unless the user supplies a working example, and say so when you do.

If you need a format that is not listed, copy a similar property from a scaffolded component of the same type (`node_modules/@pega/custom-dx-components/src/tasks/create/templates/Constellation/<Type>/<Subtype>/config.json.mustache`) rather than inventing one.

## Standard Field property layout

Pega's own Fields follow one order, and so do the scaffolds. Keep it so the property panel feels familiar:

1. `label`, `hideLabel`, `readOnly` at the top level.
2. A `GROUP` "Input settings" (edit-only settings such as `placeholder`, `helperText`), gated by `"visibility": "(!readOnly = true)"`.
3. A `GROUP` "Read-only settings" for display formatting, when there is any.
4. A `GROUP` "Conditions" with `REQUIRED` (edit-only), `DISABLED` and `VISIBILITY`.
5. A collapsible `GROUP` "Advanced" with a `testId` property:

```json
{
  "label": "Advanced",
  "format": "GROUP",
  "collapsible": true,
  "properties": [
    {
      "name": "testId",
      "label": "Test ID",
      "format": "TEXT",
      "ignorePattern": "[^-_\\p{N}\\p{L}]",
      "includeAnnotations": false
    }
  ]
}
```

Property `name` is camelCase for Fields and Widgets. Template region and layout names are PascalCase or a single letter (`NumCols`, `Fields`, `A`, `B`); do not rename them in a copied scaffold. `label` text is sentence case and is never prefixed with `@L`; only default values are localized that way. Keep `helperText` to one short sentence about a consequence or constraint; use `additionalInfo: { heading?, content }` for anything longer.

## Authoring design rules

- **Persist a stable key, not a label.** A `SELECT` stores its `key`; the `value` can be translated. Changing a `key` breaks every saved view.
- **Hidden does not mean deleted.** When a visibility condition or `CASCADE` hides a property, its old value stays in the saved metadata. Decide for each conditional property whether the component ignores, clears or still honors it, and make `index.tsx` safe against a stale value. Use `clearElementsOnSwitch` when a stale value would change meaning.
- **Defaults apply only when the key is absent.** They do not repair a malformed saved value. The precedence is saved value, then `defaultConfig` / `defaultValue`, then the fallback in the component. Treat absent, `null`, `''`, `0` and `false` as different inputs and say which the component accepts.
- **Keep authoring settings separate from runtime state.** Focus, hover, open menus, request status and filter text never belong in `config.json`. Secrets, endpoints and data page names that vary per environment do not either.
- **Fewer properties is better.** Every property adds persisted surface, test cases and migration cost. Start with the smallest set that makes the component usable.
- **Do not expose two controls for one runtime key** unless their visibility conditions are mutually exclusive.

### Property ledger

Keep this table in the plan for any component with more than a couple of properties. A key is unfinished until every column is known; mismatches (`readOnly` in JSON but `readonly` in code, a string default for a number, a picker that persists objects while the code expects strings) are the usual bugs.

| Config key | Format | Default | Prop in `index.tsx` | Hidden or legacy behavior | Test |
| --- | --- | --- | --- | --- | --- |
| `maxLength` | `NUMBER` | none | `maxLength?: number` | ignored when not a positive number | boundary story and test |

### Safe and risky changes to an existing component

Adding an optional property is low risk when it has a backward-compatible default, existing metadata renders identically when the key is absent, and it does not hide or reinterpret an existing control. Test both the absent key and an explicit value.

These need an explicit compatibility decision from the user, because saved views already use the old shape: renaming `name` or a property key or region name, changing the type of a saved value, changing a `SELECT` `key`, changing a `CONTENTPICKER` from scalars to objects, removing a property or region, and changing `defaultConfig` so existing components behave differently. Prefer adding the new shape and keeping the old one.

## `defaultConfig` bindings

Besides literals, scaffolds use these bindings in `defaultConfig`:

| Binding                                     | Meaning                                                       |
| ------------------------------------------- | ------------------------------------------------------------- |
| `"@P .pyLabel"`                             | Value of a property on the current page                       |
| `"@L $this.label"`, `"@L Select..."`        | Localized text (the field's own label, or a literal)          |
| `"@DATASOURCE D_pyAnnouncements.pxResults"` | A data page and the result list to bind to                    |
| `"@ASSOCIATED .$this.name"`                 | The associated (list-of-values) source for the bound property |
| `"@FL .$this.name"`                         | The bound property's field label (the most common default for a Field `caption`) |

Scaffolded fields also carry layout flags in `defaultConfig` (for example `detailFVLItem`, `isFormWidth`). Leave them as generated.

## Keep `config.json` and `index.tsx` in sync

- Add a property: add the entry to `properties`, add the prop (with its type) to the props interface in `index.tsx`, and use it in the component. Give it a safe default in the destructuring (`const { max = 100 } = props;`) because a designer may leave it empty.
- Remove a property: remove it from all three places.
- Rename a property: it is a breaking change for any view that already configures it. Prefer adding a new property and keeping the old one until the user confirms.
- Boolean and numeric properties can reach the component as strings. Normalize them before use, as the scaffolded fields do for `readOnly`, `required` and `disabled` (and `parseInt` for numeric settings such as `decimalPrecision`).
- After editing, run `npm run validate-schema -- <Org>_<Library>_<Name>`.

## Key and property rules

- `name` must match the folder name exactly, and `componentKey` must equal `name`.
- `library` must match `component.library` in [tasks.config.json](../../../../tasks.config.json), and `organization` must match the organization there (library mode enforces both).
- `icon` is optional and names an SVG in the component folder.
- `SELECT` requires a `source` array of `{ "key", "value" }` pairs. `GROUP` carries a nested `properties` array and has no `name`. `INSTRUCTIONS` renders help text and has no `name`. `CONTENTPICKER` is for Templates: it lets App Studio authors add child fields and views.
- Every `name` must match a prop consumed in `index.tsx`. Do not declare properties the component ignores.

## Valid `subtype` values


Use these exact values (the CLI `create` argument and `config.json` `subtype`). A wrong value or casing fails `validate-schema` with `data/subtype must be equal to one of the allowed values`.

| type           | subtype                                                                                                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Field`        | `Text`, `Text-Input`, `Text-Paragraph`, `Text-Email`, `Text-Phone`, `Text-URL`, `Icon-Button-URL`, `Integer`, `Decimal`, `Decimal-Currency`, `Decimal-Percentage`, `Boolean`, `Date`, `DateTime`, `TimeOfDay`, `Picklist`, `Picklist-Autocomplete`, `Picklist-RadioButtons` |
| `Template`     | `FORM`, `FORM-region`, `DETAILS`, `DETAILS-region`, `PAGE`                                                                                                                                    |
| `Widget`       | `CASE`, `PAGE`, or the array `["PAGE", "CASE"]` (shown in the picker as "PAGE & CASE")                                                                                                         |
| `Presentation` | `CASEVIEW`, `WSSCASEVIEW`                                                                                                                                                                     |

[component-manifest.json](../../generate-component-set/component-manifest.json) maps each friendly subtype name to its `cliSubtype`.

## Grouping convention


Put `label`, `hideLabel`, and `readOnly` at the top level. Group the rest by concern with `GROUP`, and gate edit-only settings behind `"visibility": "(!readOnly = true)"`.
