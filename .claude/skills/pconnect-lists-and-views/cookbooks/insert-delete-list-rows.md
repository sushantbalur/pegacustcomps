---
title: Insert and delete rows in an embedded list
keywords: [add row, remove row, insert row, delete row, dynamic list, embedded list]
primary_methods: [ListActions.insert, ListActions.deleteEntry]
related: [repeating-row-edit, reorder-list-rows]
---

# Recipe: Insert and delete rows in an embedded list

> Part of the [Lists, Containers & Views cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

An embedded/repeating list needs an "Add row" and "Remove row" affordance — inserting a new row at a specific position, or deleting an existing one — distinct from editing a field within an existing row.

## Solution

Uses [`ListActions`](../../references/pconnect-list-actions.md).

```typescript
function onAddRowClick(newRowDefaults) {
  // Inserts at index 0 so the newest row appears first; use the list's current length to append instead.
  pConn.getListActions().insert(newRowDefaults, 0);
}

function onRemoveRowClick(rowIndex) {
  pConn.getListActions().deleteEntry(rowIndex);
}
```

## Discussion

**MUST** pass a complete-enough `payload` to `insert` so the new row renders without missing required fields — unlike `update`/`updateProperty`, there's no existing row data to fall back on for fields the payload omits.

**SHOULD** re-validate any fields whose validity depends on row count or ordering (for example, "at least one row required") after a `deleteEntry` call — deleting a row can flip a form from valid to invalid without any field-level `validate()` call being triggered on its own.

## Related recipes

- [Edit a repeating row with validation, then save](./repeating-row-edit.md)
- [Reorder rows in a list](./reorder-list-rows.md)
