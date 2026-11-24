---
name: picklist
description: 'Scaffold a Pega DX Field component with subtype **Picklist** — single-select dropdown bound to a case property, sourced from a data page or a static list. Use when: user asks for a dropdown, select, combo box, option list, lookup field, or a data-page-driven picker.'
argument-hint: 'Describe the picklist (e.g., "a country dropdown sourced from D_CountryList")'
---

# Create Picklist Field

Field subtype `Picklist`. Binds to a case property whose value is one key from a list of options.

Read [../field/SKILL.md](../field/SKILL.md) for the shared Field rules first. This skill adds only what is specific to `Picklist`.

## Cosmos Mapping

| Mode | Component |
| --- | --- |
| Edit | `Select` from `@pega/cosmos-react-core` |
| `DISPLAY_ONLY` | The **display label** for the stored key, not the raw key |

## Option Sources

The platform resolves the options and passes them as props; the scaffolded component reads them rather than fetching:

- `datasource` — the option list. For an **associated** list (`listType: 'associated'`, the scaffold default `"datasource": "@ASSOCIATED .$this.name"`) it is the array of `{ key, value }` options defined on the property. For a **data page** (`listType: 'datapage'`) the options come from `pConn.getConfigProps().listOutput` (or `datasource.source`), and the property's `fieldMetadata.datasource` carries the data page name and the property used for display text.
- `fieldMetadata` — property metadata (class, data source, display property); it can be an array, so select the entry for the current class as the scaffold does.

Do **not** add `dataPage`, `keyProperty` or `labelProperty` authoring properties and fetch the options yourself with `PCore.getDataApiUtils()`: the platform already resolved them, and a second fetch duplicates requests and can disagree with the configured source. Keep the scaffold's `datasource` / `listType` handling and change only the rendering, unless the user explicitly needs a source the platform does not provide (then use a Widget or follow [pcore-rest-data-details.md](../references/pcore-rest-data-details.md) and handle loading, empty and error).

## Value Handling

- Store the **key**, render the **label**. Never store the label.
- Dispatch with `changeNblur` through the event helper: a select has no meaningful blur-versus-change distinction.
- Know the platform's auto-write behavior and decide whether to keep it. With no placeholder, an empty value and a non-empty option list, the built-in picklist commits the **first option's key** on load; if the stored key is not among the options it resets to the first option (or to `''` when a placeholder exists). It also calls `getValidationApi().validate(value)` on blur. A custom picker that does not write a default must make the empty state visible and test it.
- A placeholder is an option with value `''`; localize its text through the localization service. Compare keys as strings, and remount the control (`key`) when the bound property changes.
- Resolve the label defensively. If the stored key is not in the loaded options, fall back to the raw key rather than rendering blank, so bad data stays visible.

## config.json

Keep the scaffolded properties (`label`, `labelOption`, `readOnly`, `placeholder`, `helperText`, `required`, `disabled`, `visibility`, `testId`) and the `defaultConfig` (`listType`, `datasource`). The scaffold also ships `columnWidth` and `width`, which the platform reads for table layout; leave them unless the user asks to remove them. Add a property only when the component uses it.

## Gotchas

- Guard the loading state. A `Select` rendered with an empty options array while a value is set will appear blank and can silently clear the property.
- A data-page column can write extra properties from the selected row: call `updateFieldValue(prop, v)` then `triggerFieldChange(prop, v, true)` for each (the third argument skips validation).
- If the list can exceed roughly 50 entries, use a searchable variant — an unfiltered long dropdown is unusable.
- For multi-select, this is the wrong subtype. Use a checkbox-group field instead.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
