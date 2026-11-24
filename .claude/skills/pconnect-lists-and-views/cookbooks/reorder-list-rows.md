---
title: Reorder rows in a list
keywords: [reorder, drag and drop, move row, priority list, sequence]
primary_methods: [ListActions.reorder]
related: [insert-delete-list-rows]
---

# Recipe: Reorder rows in a list

> Part of the [Lists, Containers & Views cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A list where row order itself is meaningful (a priority queue, a ranked sequence of steps) needs to support moving a row to a new position, whether via drag-and-drop or explicit "move up"/"move down" controls.

## Solution

Uses [`ListActions`](../../references/pconnect-list-actions.md).

```typescript
function onDropRow(fromIndex, toIndex) {
  pConn.getListActions().reorder(fromIndex, toIndex);
}

function onMoveUpClick(index) {
  if (index === 0) return;
  pConn.getListActions().reorder(index, index - 1);
}
```

## Discussion

**MUST** compute `fromIndex`/`toIndex` from the list's current in-memory order at the moment of the call, not from a stale index captured earlier in the render — if the list can change between when a drag starts and when it's dropped (for example, another user's real-time update arrives mid-drag), a stale index reorders the wrong row.

**SHOULD** treat `reorder` as void/fire-and-forget for the row data itself, but still re-render from the updated list state rather than optimistically re-ordering local component state independently — `reorder` already updates the underlying store, so a separately-maintained local copy can drift out of sync.

## Related recipes

- [Insert and delete rows in an embedded list](./insert-delete-list-rows.md)
