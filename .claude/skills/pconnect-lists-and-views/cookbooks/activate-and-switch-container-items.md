---
title: Switch between container items with an unsaved-changes guard
keywords: [tabs, switch tab, side panel, active item, unsaved changes guard, dirty check]
primary_methods:
  [
    ContainerManager.activateContainerItem,
    ContainerManager.hasContainerItems,
    ContainerUtils.isContainerDirty,
    ContainerUtils.getActiveContainerItemName
  ]
related: [container-item-lifecycle]
---

# Recipe: Switch between container items with an unsaved-changes guard

> Part of the [Lists, Containers & Views cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A container hosts several items at once (for example, tabs or a multi-document side panel), and switching the active item should warn the user first if the currently active item has unsaved changes.

## Solution

Uses [`ContainerManager`](../../references/pconnect-container-manager.md) and `ContainerUtils` (via `PCore.getContainerUtils()`, see [pcore-case-collaboration-details.md](../../references/pcore-case-collaboration-details.md)).

```typescript
async function onSwitchTab(targetContainerItemID, targetName) {
  const containerManager = pConn.getContainerManager();
  const containerUtils = PCore.getContainerUtils();

  if (!containerManager.hasContainerItems()) return;

  const activeItemName = containerUtils.getActiveContainerItemName(targetName);
  if (activeItemName && containerUtils.isContainerDirty(activeItemName)) {
    const confirmed = await confirmSwitchAwayFromUnsavedTab();
    if (!confirmed) return;
  }

  await containerManager.activateContainerItem({ containerItemID: targetContainerItemID });
}
```

## Discussion

**MUST** check `hasContainerItems` before calling `getActiveContainerItemName`/`isContainerDirty` on a container that may not have any items yet — calling them on an empty container is a common source of an unhelpful "no active item" branch being reached silently instead of being guarded against explicitly.

**SHOULD** reuse the same confirmation pattern as [Show a custom confirmation dialog before a destructive action](../../pconnect-assignment-lifecycle/cookbooks/confirm-before-destructive-action.md) rather than a one-off `window.confirm`, so switching away from unsaved work is visually consistent with other destructive/interrupting confirmations in the app.

## Related recipes

- [Add a non-assignment view to a multi-item container without losing existing items](./container-item-lifecycle.md)
- [Show a custom confirmation dialog before a destructive action](../../pconnect-assignment-lifecycle/cookbooks/confirm-before-destructive-action.md)
