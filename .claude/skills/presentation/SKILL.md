---
name: presentation
description: 'Scaffold and implement a Pega DX **Presentation** component. In this tooling a Presentation component replaces how a whole case view is rendered (subtypes CASEVIEW and WSSCASEVIEW): it receives everything as props and has no access to PCore or PConnect. Use when: the user wants to restyle or restructure the case view page. NOT for badges, status pills, formatters or other read-only displays — use a Field (bound to a property) or a Widget (standalone block) for those.'
argument-hint: 'Describe the case view change (e.g., "a case view with a compact header and the tabs on the left")'
---

# Create Presentation Component Skill

## When to Use

- The user wants to **replace how a case view is rendered**: header, summary fields, tabs, stages, tasks, banners, utilities.
- The two supported subtypes are `CASEVIEW` (props type `CaseViewProps` from `@pega/cosmos-react-work`) and `WSSCASEVIEW` (props type `CaseViewProps` from `@pega/cosmos-react-wss`).

Do NOT use this skill for:

- an input or a read-only value bound to a case property, such as a badge, status pill, formatted number or icon (use `field` and handle `DISPLAY_ONLY`),
- a standalone block that shows its own data (use `widget`),
- a layout container (use `template`).

`config.json` `type: "Presentation"` accepts only the subtypes `CASEVIEW` and `WSSCASEVIEW`; any other subtype fails `validate-schema`.

## What a Presentation component is

A Presentation component is a **pure render of props**. The platform passes every piece of the case view (heading, summary fields, tabs, stages, tasks, banners, utilities, expand/collapse state and callbacks) as props whose type comes from the design system. There is no `getPConnect`, and the project's lint rule `no-pcore-pconnect-in-presentation` rejects any use of `PCore` or `getPConnect` in a component whose `config.json` has `type: "Presentation"`.

Consequently:

- Do not call `getPConnect`, `PCore`, `getActionsApi`, `getValidationApi` or any PCore/PConnect API. If the requirement needs data the props do not carry, the right component type is a Widget.
- Do not fetch data or run side-effecting effects. Local UI state (open/closed, hover) is fine.
- Render from the props the type defines. Read the type before using a prop: `node_modules/@pega/cosmos-react-work/lib/components/CaseView/CaseView.types.d.ts` (or the `@pega/cosmos-react-wss` equivalent for `WSSCASEVIEW`).

## Procedure

The repo-wide rules (gallery reuse, contract approval and its layout, authoring properties, consent, Cosmos first, no dead code) are in `AGENTS.md` and are not repeated here.

### Step 0: Check the UI Gallery

Follow [ui-gallery-reuse.md](../create-dx-component/references/ui-gallery-reuse.md).

### Step 1: Agree the contract

Use the approval layout from `AGENTS.md`. The draft states:

- **Subtype**: `CASEVIEW` or `WSSCASEVIEW`
- **Name**: PascalCase; the component key is `<Org>_<Library>_<Name>`
- **What changes**: which parts of the case view are rearranged or restyled, and what keeps the default behavior
- **Properties**: none by default (`"properties": []`); add one only if the user wants a designer-configurable setting

### Step 2: Scaffold

`npm run create -- Presentation CASEVIEW <Name> "<Label>" 1.0.0 <Library> "<description>" <Organization>`

Use `WSSCASEVIEW` instead of `CASEVIEW` for the Web Self Service variant. See [cli-workflow.md](../create-dx-component/references/cli-workflow.md) for the full command forms.

### Step 3: Implement

Implement every scaffolded file from [presentation-essentials.md](../create-dx-component/references/presentation-essentials.md): pure render from the props, no PCore or `getPConnect`, Cosmos instead of the scaffold's plain-HTML placeholder, the `create-nonce` import if you keep `styled-components`, and a test with the optional props absent.

### Step 4: Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` (`--no-build` while fixing), fix every failure, and paste the final table into your report.
