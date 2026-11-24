---
name: widget
description: 'Scaffold and implement a Pega DX **Widget** component — a standalone data-driven block (CASE or PAGE subtype) that fetches its own data via PCore. Use when: user wants a chart, KPI, table, list, spin wheel, dashboard tile, or any self-contained UI block that reads from a data page, page list, or case property.'
argument-hint: 'Describe the widget (e.g., "a bar chart of open cases by status" or "a table of related contacts from D_ContactList")'
---

# Create Widget Component Skill

## Prefer a Subtype Skill

If the subtype is clear, use the narrower skill instead — it carries the data-fetch and state rules this skill does not repeat.

| Subtype | Skill | Rendered |
| --- | --- | --- |
| CASE | `case` | Inside a case view, has case context |
| PAGE | `page-widget` | On a portal page, no case context |

Use this skill when the subtype is unclear, or the idea is unusual (a board, timeline, map, chart): see [choosing-type-and-subtype.md](../create-dx-component/references/choosing-type-and-subtype.md).

## When to Use

- User wants a **standalone UI block** that renders its own content and typically fetches its own data
- User mentions a Widget subtype: **CASE** (rendered in a case view) or **PAGE** (rendered on a portal page)
- Component uses `useEffect` + `PCore.getDataApiUtils().getData(...)` to load a data page
- Component has internal state (charts, tables, KPIs, timers, animations)

Do NOT use this skill for single-property field bindings (see `field`), layout containers (see `template`), or read-only formatters bound to a property (see `field`, which handles `DISPLAY_ONLY`).

## Procedure

The repo-wide rules (gallery reuse, contract approval and its layout, authoring properties, consent, Cosmos first, no dead code) are in `AGENTS.md` and are not repeated here.

### Step 0: Check the UI Gallery

Follow [ui-gallery-reuse.md](../create-dx-component/references/ui-gallery-reuse.md).

### Step 1: Agree the contract

Besides the name, label, description, library and version, the draft states:

- **Subtype**: CASE or PAGE
- **Data source**: data page name (`D_XXX`), case property path, or a config-supplied literal, and the fetch parameters (case key, portal context, filters)
- **Presentation**: chart, table, card grid
- **Interactions**: refresh, pagination, drill-down, actions
- **States to cover**: the applicable rows from [state-matrix.md](../create-dx-component/references/state-matrix.md)

### Step 2: Scaffold

`npm run create -- Widget <CASE|PAGE> <Name> "<Label>" <version> <Library> "<description>" <Organization>`

Pass every argument: a bare `npm run create` prompts interactively and hangs an agent. If no library exists yet, run `npm run createLib -- <Library> 1.0.0 Y Current` first. See [cli-workflow.md](../create-dx-component/references/cli-workflow.md).

### Step 3: Implement

Implement every scaffolded file from [widget-essentials.md](../create-dx-component/references/widget-essentials.md); open a deeper reference only when its closing table says so. For a complete worked example, see the [data widget cookbook](../create-dx-component/cookbooks/build-a-data-widget.md). Widgets do not need `event-utils.ts` unless they also write values back to a bound property.

### Step 4: Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` (`--no-build` while fixing), and paste the final table into your report. For a new component, run the `review-component` skill as described in [create-dx-component](../create-dx-component/SKILL.md). `npm run startStorybook` is long-running, so leave it to the user.
