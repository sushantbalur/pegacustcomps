---
name: decimal
description: 'Scaffold a Pega DX Field component with subtype **Decimal** — fractional number input bound to a decimal case property. Use when: user asks for a decimal input, measurement, weight, rate, score, ratio, or a precision-formatted number display.'
argument-hint: 'Describe the decimal field (e.g., "a weight input in kg with three decimals")'
---

# Create Decimal Field

Field subtype `Decimal`. Binds to a fractional-number case property.

Read [../field/SKILL.md](../field/SKILL.md) for the shared Field rules first. This skill adds only what is specific to `Decimal`.

## Cosmos Mapping

| Mode | Component |
| --- | --- |
| Edit | `NumberInput` from `@pega/cosmos-react-core` |
| `DISPLAY_ONLY` | Number formatted to the configured precision |

## Value Handling

- Keep the raw typed string in the input while the user is editing. Converting on every keystroke destroys a trailing decimal point and blocks typing `1.` on the way to `1.5`.
- Convert and dispatch on blur:
  Take the entered text from the event; the value to commit is `''` for empty text and `Number(text)` otherwise, sent with `changeNblur`.
- Dispatch `''` for an empty input (what the platform's numeric fields send), never `0` and never `NaN`. The stored value can be `null`; read it as `valueProp ?? ''`.
- Read the entered text from the blur event and skip the commit when it equals the stored value; call `validate(entered)` only. See [field-behavior.md](../create-dx-component/references/field-behavior.md).
- Keep intermediate drafts such as `-`, `-0` and `-0.` valid while typing.
- Apply the configured precision on blur, not while typing.

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `precision` | Decimal places | `NUMBER` | `2` |  |
| `min` | Minimum | `NUMBER` |  |  |
| `max` | Maximum | `NUMBER` |  |  |
| `unit` | Unit suffix | `TEXT` |  |  |

## Gotchas

- Decimal separators are locale-dependent. Cosmos `NumberInput` hands your blur callback a canonical dot-separated string, so check what it passes before adding your own comma handling; if you parse user text yourself, normalize a comma decimal before `Number()`, which would otherwise yield `NaN`.
- Compare the stored value and the parsed entry as strings (`value.toString() !== parsable`), not with `===` on floats and not with an epsilon. Then `1.600` redisplays as `1.6` after commit.
- `decimalPrecision` arrives as a string. `parseInt` it; an empty string means unlimited, but any other `NaN` should fall back to 2.
- `toFixed` returns a string. Dispatch the numeric value, and use the fixed string only for display.
- If the property is truly monetary, use `currency` instead — it carries the currency code and minor-unit rules.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
