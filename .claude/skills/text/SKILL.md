---
name: text
description: 'Scaffold a Pega DX Field component with subtype **Text** — free-text single-line or multi-line input bound to a string case property. Use when: user asks for a text field, string input, notes/comment box, masked text, textarea, or a custom-formatted text display.'
argument-hint: 'Describe the text field (e.g., "a single-line SSN input with a mask")'
---

# Create Text Field

Field subtype `Text`. Binds to a string case property.

Read [../field/SKILL.md](../field/SKILL.md) for the shared Field rules first. This skill adds only what is specific to `Text`.

## Cosmos Mapping

| Mode | Component |
| --- | --- |
| Edit, single line | `Input` from `@pega/cosmos-react-core` |
| Edit, multi line | `TextArea` |
| `DISPLAY_ONLY` | Raw `{value}` inside the styled wrapper |

## Value Handling

- `value` arrives as `string`. Default it to `''`, never `undefined`, or the input flips to uncontrolled.
- `onChange` sends `event.target.value` straight through — no coercion.
- Trim only on blur if the requirement calls for it, and send the trimmed value through `handleEvent(actions, 'blur', propName, trimmed)`.

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `placeholder` | Placeholder | `TEXT` |  |  |
| `maxLength` | Maximum length | `NUMBER` |  |  |
| `multiLine` | Multi-line | `BOOLEAN` | `false` |  |

## Gotchas

- **`Input` does not render a character counter.** Passing `maxLength` only sets the native attribute. Only `TextArea` has `maxLength` + `displayCharCount`. For a counter on a single-line field, wrap a bare `Input` in your own `FormField` and set `charLimitDisplay`.
- **`Input` renders its own `FormField` when `label` is passed.** If you compose it inside your own `FormField`, pass `label` to the outer one only, or you nest two. Give both the **same explicit `id`** so the label's `htmlFor` resolves.
- **`FormField.onClear` only renders for radio/checkbox groups** (it is gated behind `isRadioCheck`). For a text input clear button, pass an `actions` array instead.
- For masked input, mask on change and store the unmasked value in the case property unless the business rule says otherwise.
- `TextArea` needs an explicit `rows` or it collapses to one line in some Constellation containers.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
