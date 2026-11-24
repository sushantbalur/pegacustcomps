---
name: page
description: 'Scaffold a Pega DX Template component with subtype **PAGE** — a full-page layout that arranges regions such as header, sidebar, main content, and footer. Use when: user asks for a page layout, portal shell, dashboard arrangement, landing page structure, or a multi-region container.'
argument-hint: 'Describe the page layout (e.g., "a page with a left sidebar and a scrollable main region")'
---

# Create PAGE Template

Template subtype `PAGE`. Arranges top-level regions for a whole page rather than fields within a form.

Read [../template/SKILL.md](../template/SKILL.md) for the shared Template rules first. This skill adds only what is specific to `PAGE`.

## Cosmos Mapping

| Concern | Component |
| --- | --- |
| Region grid | `Grid` with named `cols` and `rows` |
| Vertical or horizontal stacks | `Flex` |
| Region container | `Card` + `CardHeader` + `CardContent` |
| Region separation | `Grid` or `Flex` gap, or a `Card` border (Cosmos has no `Divider`) |

## Scope

`PAGE` is the widest template scope:

| Subtype | Arranges |
| --- | --- |
| `FORM` | Input fields inside a view |
| `DETAILS` | Read-only values inside a view |
| `PAGE` | Whole regions, each of which may contain views and widgets |

## Layout Rules

- Define regions explicitly and name them `A` and `B` (plus others the design needs) as the scaffold does; the template finds each by `getRawMetadata().name` and falls back to the first child. The author assigns children through one `CONTENTPICKER` per region.
- Delegate to the Cosmos page templates (`OneColumnPage`, `TwoColumnPage`, `ThreeColumnPage`, `NarrowWidePage`, `WideNarrowPage`, `TabbedPage`) where the installed version has them, and pass region elements into their `a`, `b`, `c` slots. They own scrolling, the `md` breakpoint, sticky regions and heading focus. See [template-patterns.md](../create-dx-component/references/template-patterns.md).
- The main region must own the scroll. Do not make the whole page scroll when a sidebar should stay fixed.
- Sidebars need a fixed or clamped width; only the main region should flex.
- Every region must tolerate being empty. A page whose sidebar has no children must not leave a gap or collapse the main region.

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `layout` | Region layout | `SELECT` | `"single"` | options: `single`, `sidebarLeft`, `sidebarRight`, `twoColumn` |
| `sidebarWidth` | Sidebar width | `TEXT` | `"280px"` | visible when `$this.layout == 'sidebarLeft' \|\| $this.layout == 'sidebarRight'` |
| (help text) |  | `INSTRUCTIONS` |  | no name; shows help text |
| `A` | Region A | `CONTENTPICKER` |  | allows creating groups |
| `B` | Region B | `CONTENTPICKER` |  | visible when `$this.layout != 'single'`; allows creating groups |

## Gotchas

- Use `visibility` expressions so sidebar-only properties disappear for single-column layouts. An always-visible irrelevant property confuses authors.
- Do not set `document.title` or move focus to a heading; the platform and Cosmos do both. Add no `<main>` landmark; the shell owns it.
- Do not set a viewport height on the root. The Constellation shell owns the page frame, and a nested `100vh` produces a double scrollbar.
- Page templates are the most likely to tempt inline styles for positioning. Keep any custom CSS in `styles.ts`.
- Responsive collapse belongs to the Cosmos `Grid`, not a hand-written media query.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
