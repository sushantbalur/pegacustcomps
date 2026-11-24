---
name: details
description: 'Scaffold a Pega DX Template component with subtype **DETAILS** — a read-only layout that presents child field values as label-value pairs. Use when: user asks for a details view, summary panel, review section, read-only case snapshot, or a label-value arrangement.'
argument-hint: 'Describe the details layout (e.g., "a two-column summary panel with inline labels")'
---

# Create DETAILS Template

Template subtype `DETAILS`. Presents child field values **read-only**, as label-value pairs.

Read [../template/SKILL.md](../template/SKILL.md) for the shared Template rules first. This skill adds only what is specific to `DETAILS`.

## Cosmos Mapping

| Concern | Component |
| --- | --- |
| Label-value pairs | `FieldValueList` with `variant='inline'` or `'stacked'` |
| Column arrangement | `Grid` |
| Named section | `FieldGroup`, or `Card` + `CardHeader` + `CardContent` |

## Label Variants

| Variant | Layout | Use when |
| --- | --- | --- |
| `inline` | Label left, value right | Dense summaries, wide containers |
| `stacked` | Label above value | Narrow columns, long values |

Expose this choice as a config property rather than hard-coding it.

## Layout Rules

- **Force read-only on the children.** The shipped DETAILS scaffold calls `child.props.getPConnect().setInheritedProp('readOnly', true)` and `setInheritedProp('displayMode', 'DISPLAY_ONLY')` on every region child; without it the template shows editable inputs. Keep those calls (they must be idempotent).
- `children` are regions. Read each region's fields with `getChildren()`, render them with a memoized `getComponent()`, and read the label and variant from `resolveConfigProps(getConfigProps())`. See [template-patterns.md](../create-dx-component/references/template-patterns.md).
- Use `inline` labels by default and **stacked** when the value is long (a text area or rich text of about 60 characters or more, an image URL, a map). A Checkbox's label is its `caption`.
- Check whether the installed `@pega/cosmos-react-work` exports `Details` / `DetailsList`; they handle column fitting, heading depth and label alignment, and are what Pega's own details view uses.
- Prefer one `FieldValueList` over many, so labels align on a shared column. Separate lists break the alignment grid.
- Empty values should render a neutral placeholder such as an em dash, not a blank cell that looks like a rendering bug.

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `variant` | Label placement | `SELECT` | `"inline"` | options: `inline`, `stacked` |
| `NumCols` | Number of columns | `SELECT` | `"1"` | options: `1`, `2` |
| `showLabel` | Show section label | `BOOLEAN` | `true` |  |
| (help text) |  | `INSTRUCTIONS` |  | no name; shows help text |
| `A` | Region A | `CONTENTPICKER` |  | allows creating groups |

The shipped DETAILS scaffold names its regions `A` and `B` (`A` for the main column, `B` for the second); `Fields` is only used by a single-region form. Keep the scaffold's region names.

## Gotchas

- Do not render inputs. If the author needs editing, the correct subtype is `form`.
- `FieldValueList` needs a stable `id` per entry. Do not use the array index.
- A details template must not call `updateFieldValue` or `triggerFieldChange`.
- Long values need wrapping, not truncation, unless the author explicitly asked for truncation.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
