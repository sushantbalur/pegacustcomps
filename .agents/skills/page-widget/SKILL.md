---
name: page-widget
description: 'Scaffold a Pega DX Widget component with subtype **PAGE** — a standalone data-driven block rendered on a portal page or dashboard, with no case context. Use when: user asks for a dashboard tile, portal KPI, org-wide chart, worklist summary, announcement panel, or a landing-page block.'
argument-hint: 'Describe the page widget (e.g., "a dashboard tile counting open cases by status")'
---

# Create PAGE Widget

Widget subtype `PAGE`. Rendered on a **portal page or dashboard**, outside any case.

Read [../widget/SKILL.md](../widget/SKILL.md) for the shared Widget rules first. This skill adds only what is specific to `PAGE`.

## Defining Trait

A PAGE widget has **no case context**. There is no `CaseInstanceKey` to pass, and `PCore.getConstants().CASE_INFO.CASE_INFO_ID` will not resolve to anything useful.

If the block needs the current case, use `case` instead.

## Data Fetch

Parameters come from `config.json` or the operator context, not from a case. Call `PCore.getDataApiUtils().getData(dataPage, { dataViewParameters: params }, context)` in a `useEffect` keyed on `[context, dataPage]` plus a stable key for the parameters (`JSON.stringify(params)`, not the object). Reset loading and error first, ignore a response that arrives after unmount or a dependency change, and keep a failure distinct from an empty result. The guarded fetch shape is in [widget-patterns.md](../create-dx-component/references/widget-patterns.md).

Lifecycle, cancellation, subscriptions, mutations and traps: [widget-patterns.md](../create-dx-component/references/widget-patterns.md).

Operator and environment details are available through `PCore.getEnvironmentInfo()`.

## Required States

| State | Cosmos component |
| --- | --- |
| Loading | `Progress` |
| Empty | `EmptyState` |
| Error | `ErrorState` (with `onRetry`) or `Banner` |
| Data | `Table`, `Grid`, `Count`, `Status`, or a chart |

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `label` | Label value | `TEXT` |  |  |
| `dataPage` | Data page | `TEXT` |  |  |
| `refreshInterval` | Refresh interval (seconds, 0 = off) | `NUMBER` | `0` |  |
| `maxRows` | Maximum rows | `NUMBER` | `10` |  |

## Gotchas

- Dashboards render many widgets at once. Fetch once, respect `maxRows`, and do not poll unless the author enabled `refreshInterval`.
- If polling is enabled, clear the interval in the effect cleanup, or navigating away leaks a timer that keeps hitting the server.
- A dashboard tile must degrade quietly. On error show a small `Banner` inside the card rather than an empty tile or a thrown error that breaks the whole dashboard.
- Give the tile a predictable height so the dashboard grid does not reflow when data arrives.
- Do not assume an operator has access to every record the data page can return. Let the server filter; never filter for authorization on the client.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
