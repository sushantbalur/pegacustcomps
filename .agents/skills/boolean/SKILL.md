---
name: boolean
description: 'Scaffold a Pega DX Field component with subtype **Boolean** — true/false input bound to a boolean case property. Use when: user asks for a checkbox, toggle, switch, yes/no field, consent or opt-in control, or a boolean display.'
argument-hint: 'Describe the boolean field (e.g., "a consent checkbox that shows Yes/No when read-only")'
---

# Create Boolean Field

Field subtype `Boolean`. Binds to a boolean case property.

Read [../field/SKILL.md](../field/SKILL.md) for the shared Field rules first. This skill adds only what is specific to `Boolean`.

## Cosmos Mapping

| Mode | Component |
| --- | --- |
| Edit | `Checkbox` from `@pega/cosmos-react-core` |
| `DISPLAY_ONLY` | `BooleanDisplay` |

## Value Handling

- `value` may arrive as a real boolean **or** the strings `'true'` / `'false'`. Normalize before render: checked only when `value === true || value === 'true'`.
- A property that was never set arrives as `null`. A checkbox has no null state: show it unchecked and write `false` with `handleEvent(actions, 'change', propName, false, { skipDirtyValidation: true })` so the form is not marked dirty by a value the user never touched. If you offer a two-radio (true/false) variant, skip that write so "unset" stays distinct from "false".
- `onChange` sends `event.target.checked`, not `event.target.value`.
- Boolean fields use `changeNblur` — dispatch the change and the field-change in one step, since there is no meaningful blur for a checkbox: `handleEvent(actions, 'changeNblur', propName, event.target.checked)`.

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `trueLabel` | Label when true | `TEXT` | `"Yes"` |  |
| `falseLabel` | Label when false | `TEXT` | `"No"` |  |

## Gotchas

- `Checkbox` renders its own label. Do not add a separate `Text` label beside it. Production uses two labels: the field `label` is the legend of a `CheckboxGroup`, and the checkbox's own `label` comes from a `caption` prop (default `@FL .$this.name`). It uses a bare `Checkbox` only when the label is hidden or empty. Add `caption` to `config.json` if you want that split, and put `info` and `status` on the group (or on the bare checkbox).
- Custom true/false text (`trueLabel`, `falseLabel`) is read from raw config, strips a leading `@L`, and is localized with the localization service.
- A required boolean means "must be checked". Validation must reject `false`, not just `undefined`.
- `hideLabel` on a checkbox still needs an accessible name — keep the `label` prop populated and set `labelHidden`.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
