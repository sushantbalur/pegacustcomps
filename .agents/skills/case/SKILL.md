---
name: case
description: 'Scaffold a Pega DX Widget component with subtype **CASE** — a data-driven block rendered inside a case view, with access to the current case context. Use when: user asks for a case-scoped chart, KPI, related-records table, case timeline, attachment list, or any block that reads the current case ID.'
argument-hint: 'Describe the case widget (e.g., "a table of related contacts for the current case")'
---

# Create CASE Widget

Widget subtype `CASE`. Rendered **inside a case view** and has access to the current case.

Read [../widget/SKILL.md](../widget/SKILL.md) for the shared Widget rules first. This skill adds only what is specific to `CASE`.

## Defining Trait

A CASE widget can read the case it is rendered in.

Take the property name from `PCore.getConstants().CASE_INFO.CASE_INFO_ID` and read the ID with `pConn.getValue(thatProperty, '')`.

If the block does **not** need the case, use `page-widget` instead — a CASE widget placed on a portal page has no case to read and will fetch with an empty key.

## Reading the case

`CaseInfo` has no status getter (check the typedefs before assuming a getter exists). Read case identity with `pConn.getCaseInfo()` (`getKey()`, `getID()`, ...) and case properties with `pConn.getValue(propertyPath, defaultValue)`. Confirm the property path in your application.

## Data Fetch

Pass the case key as the `CaseInstanceKey` data-view parameter (`{ dataViewParameters: { CaseInstanceKey: caseID } }`) to `PCore.getDataApiUtils().getData(dataPage, payload, context)`. Run it in a `useEffect` keyed on `[context, caseID, dataPage]`: reset loading and error first, ignore a response that arrives after unmount or a dependency change, and keep a failure distinct from an empty result. The guarded fetch shape is in [widget-patterns.md](../create-dx-component/references/widget-patterns.md).

See [widget-patterns.md](../create-dx-component/references/widget-patterns.md) for cancellation, subscriptions (a case widget often refetches on a case push), mutations and the traps to avoid.

## Required States

| State | Cosmos component |
| --- | --- |
| Loading | `Progress` |
| Empty | `EmptyState` |
| Error | `ErrorState` (with `onRetry`) or `Banner` |
| Data | `Table`, `Grid`, or a chart |

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `label` | Label value | `TEXT` |  |  |
| `dataPage` | Data page | `TEXT` |  |  |
| `maxRows` | Maximum rows | `NUMBER` | `10` |  |

## Gotchas

- Guard the empty case ID. On first render `caseID` may be `''`, and fetching with it returns unrelated rows or an error — skip the fetch until it is populated.
- Include `caseID` in the effect dependency array, or the widget shows stale data after the user navigates to a different case.
- Do not refetch on every parent re-render. A Constellation case view re-renders often.
- Write-back to a case property must go through `updateFieldValue` plus `triggerFieldChange`, preserving the source's original shape.
- The widget must not assume it is the only consumer of the data page — never mutate the response array in place.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
