---
title: Add a non-assignment view to a multi-item container without losing existing items
keywords:
  [
    utility container,
    side panel,
    non-assignment view,
    multiple container,
    addContainerItem,
    dirty check,
    closeContainerItem
  ]
primary_methods:
  [
    ContainerManager.initializeContainers,
    ContainerManager.addContainerItem,
    ContainerUtils.isContainerInitialized,
    ContainerUtils.closeContainerItem
  ]
related: [modal-assignment-submit, full-form-validation]
---

# Recipe: Add a non-assignment view to a multi-item container without losing existing items

> Part of the [Lists, Containers & Views cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A custom shell wants a "multiple" container (for example, a side panel that can hold several open items at once, like a document comparison view) that can add arbitrary views — not just assignments — without wiping out items a user already has open, and that checks for unsaved changes before closing one.

## Solution

Uses [`ContainerManager`](../../references/pconnect-container-manager.md) and `ContainerUtils` (via `PCore.getContainerUtils()`, see [pcore-case-collaboration-details.md](../../references/pcore-case-collaboration-details.md)).

```typescript
const containerManager = pConn.getContainerManager();
const containerUtils = PCore.getContainerUtils();

if (!containerUtils.isContainerInitialized(context, containerName)) {
  await containerManager.initializeContainers({ type: 'multiple', name: containerName });
}

await containerManager.addContainerItem({ context, semanticURL: '' });

// Later, when the user closes one item:
async function onCloseItem(containerItemID: string) {
  if (containerUtils.isContainerDirty(containerItemID) && !(await confirmDiscard())) return;
  await containerUtils.closeContainerItem(containerItemID, { skipDirtyCheck: true });
}
```

## Discussion

**NEVER** call `initializeContainers` unconditionally before every `addContainerItem` — for a `multiple` container, re-initializing resets the items a user already has open. **ALWAYS** guard it with `isContainerInitialized` first.

`closeContainerItem` (on `ContainerUtils`) and `removeContainerItem` (on `ContainerManager`) are not interchangeable: `closeContainerItem` performs the dirty check itself unless you pass `skipDirtyCheck`, which is why this recipe checks `isContainerDirty` up front and then explicitly skips the built-in check to avoid asking the user twice.

## Related recipes

- [Open an assignment in a modal, edit, validate, submit, and close](../../pconnect-assignment-lifecycle/cookbooks/modal-assignment-submit.md)
- [Full-form validation before submit](../../pconnect-forms-and-fields/cookbooks/full-form-validation.md)
