---
name: radiobuttons
description: 'Scaffold a Pega DX Field component with subtype **Radiobuttons** — single-select radio group bound to a case property. Use when: user asks for radio buttons, a mutually exclusive option group, a rating scale, a segmented choice, or an inline yes/no/maybe selector.'
argument-hint: 'Describe the radio group (e.g., "a three-option priority selector shown inline")'
---

# Create Radiobuttons Field

Field subtype `Radiobuttons`. Binds to a case property whose value is one key from a small option set.

Read [../field/SKILL.md](../field/SKILL.md) for the shared Field rules first. This skill adds only what is specific to `Radiobuttons`.

## Cosmos Mapping

| Mode | Component |
| --- | --- |
| Edit | `RadioButtonGroup` from `@pega/cosmos-react-core` |
| `DISPLAY_ONLY` | The **display label** for the stored key |

## Picklist or Radiobuttons

| Use radio buttons when | Use a picklist when |
| --- | --- |
| Two to roughly five options | More than five options |
| All options should be visible at once | The list is long or data-page driven |
| The choice is central to the form | The choice is secondary |

## Value Handling

- Store the **key**, render the **label**, exactly as with a picklist.
- Dispatch with `changeNblur`.
- Every option needs a stable `key`. Do not use the array index — reordering the options would silently remap stored data. Compare keys as strings (`` `${value}` === `${item.key}` ``) and give the group a `name` of `pageReference.propName` so two groups on different pages never share a name.
- On blur call `validate(value)` only when there is no value, so a required group reports its error.

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `orientation` | Orientation | `SELECT` | `"vertical"` | options: `vertical`, `horizontal` |
| `options` | Options (comma separated) | `TEXT` |  |  |

## Gotchas

- `RadioButtonGroup` owns the group label and the accessible grouping. Do not wrap it in a separate `FieldGroup` label as well, or screen readers announce the name twice.
- A radio group cannot be deselected by default. The platform's own group offers an opt-in clear (`allowClear` with `onClear` committing `''`) and an environment flag for click-to-deselect; if you need it, add it deliberately as an authoring option, or add an explicit "None" option. Do not assume an empty click clears the value.
- Keep every option label short enough to read inline when `orientation` is `horizontal`.
- Do not use radio buttons for a true boolean — use `boolean`.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
