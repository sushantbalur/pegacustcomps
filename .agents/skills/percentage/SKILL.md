---
name: percentage
description: 'Scaffold a Pega DX Field component with subtype **Percentage** — percent value input bound to a numeric case property. Use when: user asks for a percentage input, discount rate, completion percent, interest rate, tax rate, or a percent display.'
argument-hint: 'Describe the percentage field (e.g., "a discount rate capped at 100%")'
---

# Create Percentage Field

Field subtype `Percentage`. Binds to a numeric case property holding a percentage.

Read [../field/SKILL.md](../field/SKILL.md) for the shared Field rules first. This skill adds only what is specific to `Percentage`.

## Cosmos Mapping

| Mode | Component |
| --- | --- |
| Edit | `NumberInput` from `@pega/cosmos-react-core` with a `%` suffix |
| `DISPLAY_ONLY` | Formatted number followed by `%` |

## Value Handling

**Decide the storage convention first and document it in `config.json`.** This is the single most common defect in this subtype.

| Convention | Stored for 25% | Use when |
| --- | --- | --- |
| Whole number | `25` | The property feeds reports or display |
| Fraction | `0.25` | The property feeds calculations |

- Convert once, at the boundary, and never twice. A double conversion turns 25% into 0.0025.
- The platform has an application-level default for this: `PCore.getFieldDefaultUtils().fieldDefaults.Percentage.storePercentageAsDecimal`. Use it as the default for the property below so a custom field stores values the same way as the built-in ones.
- When storing a fraction, display is `value * 100` and commit is `value / 100` rounded to `precision + 2` decimals. If `precision` is empty the helper's default of 2 applies, so a stored `0.123456` shows as `12.35`; set the precision on purpose.
- Clear the input with `''`, not `null` or `0`; read the stored value as `valueProp ?? ''`.
- Expose the convention as the `storageMode` property in the table below so the author cannot guess wrong.

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `storageMode` | Stored as | `SELECT` | `"whole"` | options: `whole` (25 = 25%), `fraction` (0.25 = 25%); default it from the platform setting above |
| `precision` | Decimal places | `NUMBER` | `0` |  |
| `min` | Minimum percent | `NUMBER` | `0` |  |
| `max` | Maximum percent | `NUMBER` | `100` |  |

## Gotchas

- Do not assume the range is `0`–`100`. Growth rates, variances, and margins legitimately exceed 100 or go negative — drive the bounds from config.
- Never render the `%` sign by concatenating it into the stored value.
- If the field feeds a calculation elsewhere in the case, the fraction convention avoids a divide-by-100 in every consumer.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
