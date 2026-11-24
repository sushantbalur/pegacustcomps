---
name: form
description: 'Scaffold a Pega DX Template component with subtype **FORM** — an editable layout that arranges child input fields for data entry. Use when: user asks for a form layout, multi-column entry form, field group arrangement, wizard step layout, or an editable section container.'
argument-hint: 'Describe the form layout (e.g., "a two-column form with a full-width notes row")'
---

# Create FORM Template

Template subtype `FORM`. Arranges child **input** fields for data entry.

Read [../template/SKILL.md](../template/SKILL.md) for the shared Template rules first. This skill adds only what is specific to `FORM`.

## Cosmos Mapping

| Concern | Component |
| --- | --- |
| Column arrangement | `Grid` with `container={{ cols: 'repeat(N, minmax(0, 1fr))', gap: 2 }}` |
| Named section | `FieldGroup` |
| Stacked rows | `Flex` with `container={{ direction: 'column', gap: 2 }}` |

## FORM vs DETAILS

`FORM` renders fields in **edit** mode. If every child is read-only, the author wants `details` instead — using FORM there produces inputs that cannot be edited.

## Layout Rules

- Render `children` directly into the `Grid`. Constellation has already resolved each child to a field component.
- Column count comes from the `NumCols` config property, never a literal.
- Large controls (`TextArea`, `RichText`, `RadioButtons`, `Checkbox` groups, `Attachment`, `Address`, `Group`, tables and references) span the whole row: `item={{ colStart: '1', colEnd: cols + 1 }}`. A field's `isFormWidth` config flag asks for the same. This needs per-field access, so go one level below the regions (see [template-patterns.md](../create-dx-component/references/template-patterns.md)).
- Show `instructions` (from the `INSTRUCTIONS` property) only when a heading is shown. `templateOverrideMode` and `inheritParentLayout` let a nested form keep its parent's column count; add them if the template can be nested.
- Do not intercept or reorder `children`. The author controls order through the content picker.

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `NumCols` | Number of columns | `SELECT` | `"1"` | options: `1`, `2`, `3` |
| `showLabel` | Show section label | `BOOLEAN` | `true` |  |
| (help text) |  | `INSTRUCTIONS` |  | no name; shows help text |
| `Fields` | Fields | `CONTENTPICKER` |  | allows creating groups |

## Gotchas

- `minmax(0, 1fr)` is required, not `1fr`. Without it a long value inside a child overflows the column instead of wrapping.
- Merge `getPConnect().getInheritedProps()` before deciding whether to render the label — the parent may already be showing it.
- Multi-column forms must collapse to a single column when narrow. Prefer container-width wrapping (a `ResizeObserver` on the template container) to a viewport query, because a template often sits in a side panel or modal; otherwise use the Cosmos `Grid` responsive props. A theme that places helper text above fields also forces one column.
- Do not add validation or submit handling. The surrounding Constellation view owns both.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
