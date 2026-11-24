---
name: template
description: 'Scaffold and implement a Pega DX **Template** component — a layout container that arranges child views/fields (FORM, DETAILS, PAGE subtypes). Use when: user wants a layout wrapper, a custom column/section arrangement, a container for child fields, or asks for a Template subtype.'
argument-hint: 'Describe the layout (e.g., "a two-column form with a sidebar" or "a tabbed details template")'
---

# Create Template Component Skill

## Prefer a Subtype Skill

If the subtype is clear, use the narrower skill instead — it carries the layout rules this skill does not repeat.

| Subtype | Skill |
| --- | --- |
| FORM | `form` |
| DETAILS | `details` |
| PAGE | `page` |

Use this skill when the subtype is unclear, or the layout is unusual (tabs, steps, a sidebar): see [choosing-type-and-subtype.md](../create-dx-component/references/choosing-type-and-subtype.md).

## When to Use

- User wants a **layout container** that receives and arranges child components
- User mentions a Template subtype: **FORM**, **DETAILS**, **PAGE**
- User needs `CONTENTPICKER` in App Studio so authors can add child fields/views
- Component takes a `children` array as its primary content

Do NOT use this skill for components that own their own data (see `widget`), single-property bindings (see `field`), or read-only formatters (see `field`, which handles `DISPLAY_ONLY`).

## Procedure

The repo-wide rules (gallery reuse, contract approval and its layout, authoring properties, consent, Cosmos first, no dead code) are in `AGENTS.md` and are not repeated here.

### Step 0: Check the UI Gallery

Follow [ui-gallery-reuse.md](../create-dx-component/references/ui-gallery-reuse.md).

### Step 1: Agree the contract

Besides the name, label, description, library and version, the draft states:

- **Subtype**: FORM, DETAILS or PAGE
- **Layout primitive**: Cosmos `Grid`, `Flex`, `FieldGroup` or `Card` composition
- **Regions**: the region names (`A`, `B`, `C`, or `Fields`), which are required, and how they stack when narrow
- **Configurable knobs**: column count, gap, section headings, `showLabel`, orientation
- **States to cover**: the applicable rows from [state-matrix.md](../create-dx-component/references/state-matrix.md)

### Step 2: Scaffold

`npm run create -- Template <FORM|DETAILS|PAGE> <Name> "<Label>" <version> <Library> "<description>" <Organization>`

Pass every argument: a bare `npm run create` prompts interactively and hangs an agent. The CLI also accepts `FORM-region` and `DETAILS-region`. If no library exists yet, run `npm run createLib -- <Library> 1.0.0 Y Current` first. See [cli-workflow.md](../create-dx-component/references/cli-workflow.md).

### Step 3: Implement

Implement every scaffolded file from [template-essentials.md](../create-dx-component/references/template-essentials.md); open a deeper reference only when its closing table says so. Layout is where Cosmos coverage is best: never create styled-components for grids, flex rows, cards or gaps. Templates do not need `event-utils.ts`.

### Step 4: Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` (`--no-build` while fixing), and paste the final table into your report. For a new component, run the `review-component` skill as described in [create-dx-component](../create-dx-component/SKILL.md). `npm run startStorybook` is long-running, so leave it to the user.
