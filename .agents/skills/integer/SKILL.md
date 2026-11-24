---
name: integer
description: 'Scaffold a Pega DX Field component with subtype **Integer** — whole-number input bound to an integer case property. Use when: user asks for a whole number input, count, quantity, age, year, stepper, or an integer display.'
argument-hint: 'Describe the integer field (e.g., "a quantity stepper from 1 to 99")'
---

# Create Integer Field

Field subtype `Integer`. Binds to a whole-number case property.

Read [../field/SKILL.md](../field/SKILL.md) for the shared Field rules first. This skill adds only what is specific to `Integer`.

## Cosmos Mapping

| Mode | Component |
| --- | --- |
| Edit | `NumberInput` from `@pega/cosmos-react-core` |
| `DISPLAY_ONLY` | Formatted number as text |

## Value Handling

- `value` may arrive as a number or a numeric string. Keep the raw value in the input and convert only on dispatch.
- The property can be `null` when it was never set. Read it as `const value = valueProp ?? ''`.
- Accept only draft text that is `''`, `'-'`, or round-trips as an integer (`Number(s).toString() === s`), keep it as a local draft, and **commit on blur**, not on every change. The stepper and slider variants are the exception: they may never receive focus, so commit on change.
  Read the entered text from the blur event (not from state), turn it into a number or `''`, and compare it with the stored value as strings. Commit with `changeNblur` only when it differs; otherwise call `validate(entered)` alone. The handler shape is in [field-behavior.md](../create-dx-component/references/field-behavior.md).
- When the user clears the input, send `''`, which is what the platform's own numeric fields send. Do not send `NaN`, and do not send `0`. See [field-behavior.md](../create-dx-component/references/field-behavior.md).
- Set `step={1}` so the browser stepper never produces a fraction.

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `min` | Minimum | `NUMBER` |  |  |
| `max` | Maximum | `NUMBER` |  |  |
| `step` | Step | `NUMBER` | `1` |  |

## Gotchas

- `min` / `max` on the input are a UX affordance only. Enforce the same bounds in the blur handler before calling `getValidationApi().validate`.
- Do not use `parseInt` without a radix, and do not use `parseFloat` at all for this subtype.
- `Number('')` is `0`, which silently writes a wrong value. Always guard the empty case first, and never test a number with `if (!value)`, because `0` is a real value.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
