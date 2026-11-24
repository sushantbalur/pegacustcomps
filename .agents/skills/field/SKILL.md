---
name: field
description: 'Scaffold and implement a Pega DX **Field** component (Text, Boolean, Integer, Date, Email, Phone, Currency, Decimal, Percentage, URL, Picklist, Radiobuttons, etc.). Use when: user asks for an input/display component bound to a single case property; needs displayMode handling; asks for a Field subtype.'
argument-hint: 'Describe the field (e.g., "a masked SSN input" or "a color-picker field bound to .FavoriteColor")'
---

# Create Field Component Skill

## Prefer a Subtype Skill

If the subtype is clear, use the narrower skill instead — it carries the value-handling and formatting rules this skill does not repeat.

| Subtype | Skill |
| --- | --- |
| Text | `text` |
| Boolean | `boolean` |
| Integer | `integer` |
| Decimal | `decimal` |
| Currency | `currency` |
| Percentage | `percentage` |
| Date | `date` |
| Email | `email` |
| Phone | `phone` |
| URL | `url` |
| Picklist | `picklist` |
| Radiobuttons | `radiobuttons` |

Use this skill when the subtype is unclear, or for a subtype with no dedicated skill (`Text-Input`, `Text-Paragraph`, `Icon-Button-URL`, `DateTime`, `TimeOfDay`, `Picklist-Autocomplete`). The specifics of those six are in [field-subtypes-extra.md](../create-dx-component/references/field-subtypes-extra.md). For a custom control (a rating, a slider, a color or signature input), choose the subtype by the type of the **stored value** using [choosing-type-and-subtype.md](../create-dx-component/references/choosing-type-and-subtype.md), and say so if the request needs a list or several properties, which no Field subtype supports.

## When to Use

- User wants a component **bound to a single case property** (`value` in / `updateFieldValue` out)
- User mentions a Field subtype: Text, Boolean, Integer, Date, Email, Phone, Currency, Decimal, Percentage, URL, Picklist, Radiobuttons
- User needs read-only, edit, and `DISPLAY_ONLY` rendering for the same value

Do NOT use this skill for layout containers (see `template`), data-driven blocks (see `widget`), or standalone read-only blocks that never bind to a property (see `widget`).

## Procedure

The repo-wide rules (gallery reuse, contract approval and its layout, authoring properties, consent, Cosmos first, no dead code) are in `AGENTS.md` and are not repeated here.

### Step 0: Check the UI Gallery

Follow [ui-gallery-reuse.md](../create-dx-component/references/ui-gallery-reuse.md).

### Step 1: Agree the contract

Besides the name, label, description, library and version, the draft states:

- **Subtype**: any Field subtype the CLI accepts, chosen by the stored value type ([cli-workflow.md](../create-dx-component/references/cli-workflow.md))
- **Cosmos input**: which `@pega/cosmos-react-core` control renders it (`Input`, `Checkbox`, `NumberInput`, `DateInput`, `Select`, `RadioButtonGroup`, `CurrencyInput`, `PhoneInput`, `EmailDisplay` for read, etc.)
- **Field behavior**: bound property type, editable and read-only behavior, validation, display modes
- **Authoring properties**: a compact, field-specific list with formats and defaults; propose `label`, `hideLabel`, `readOnly`, `required`, `disabled`, `helperText` only when they apply
- **States to cover**: the applicable rows from [state-matrix.md](../create-dx-component/references/state-matrix.md)

### Step 2: Scaffold

`npm run create -- Field <cliSubtype> <Name> "<Label>" <version> <Library> "<description>" <Organization>`

Pass every argument: a bare `npm run create` prompts interactively and hangs an agent. `<cliSubtype>` is the exact value from [component-manifest.json](../generate-component-set/component-manifest.json) (for example `Text-Email`, `Decimal-Currency`, `Picklist-RadioButtons`). If no library exists yet, run `npm run createLib -- <Library> 1.0.0 Y Current` first.

### Step 3: Implement

Implement every scaffolded file from [field-essentials.md](../create-dx-component/references/field-essentials.md); open a deeper reference only when its closing table says so. `event-utils.ts` is generated for some subtypes (for example `Integer`, `Picklist`); if the scaffold did not create it and the component needs it, copy [event-utils.ts](../create-dx-component/assets/event-utils.ts) into the component folder and `import handleEvent from './event-utils'`.

### Step 4: Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` (`--no-build` while fixing), and paste the final table into your report. For a new component, run the `review-component` skill as described in [create-dx-component](../create-dx-component/SKILL.md). `npm run startStorybook` is long-running, so leave it to the user.
