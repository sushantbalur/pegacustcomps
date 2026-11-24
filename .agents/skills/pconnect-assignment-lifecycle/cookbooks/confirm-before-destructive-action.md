---
title: Show a custom confirmation dialog before a destructive action
keywords: [confirm dialog, are you sure, destructive action, custom modal, delete attachment, remove participant]
primary_methods: [ConfirmDialogService.registerConfirmHandler, ConfirmDialogService.confirm]
related: [safe-case-deletion, graceful-submit-failure]
---

# Recipe: Show a custom confirmation dialog before a destructive action

> Part of the [Assignment & Submission Lifecycle cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

An action like deleting an attachment or removing a participant has no built-in confirmation prompt, and the app wants its own styled confirm dialog — not the native browser `confirm()` — shown consistently before that action runs.

## Solution

Uses `ConfirmDialogService` (via `PCore.getConfirmDialogService()`, see [pcore-misc-details.md](../../references/pcore-misc-details.md)).

```typescript
// Register once, near app bootstrap.
PCore.getConfirmDialogService().registerConfirmHandler((message) => showCustomConfirmModal(message));

// At the call site of the destructive action:
async function onRemoveAttachment(attachmentID: string, context: string) {
  const confirmed = await PCore.getConfirmDialogService().confirm(
    'This attachment will be permanently removed. Continue?'
  );
  if (!confirmed) return;
  await PCore.getAttachmentUtils().deleteAttachment(attachmentID, context);
}
```

## Discussion

`registerConfirmHandler` is global and last-write-wins. **NEVER** register it per-component — registering a second handler elsewhere in the app (for example, from another custom component) silently replaces the first. **ALWAYS** register it once during bootstrap instead.

If no handler is ever registered, `confirm()` falls back to the native browser `confirm()` dialog — a missing registration won't crash the destructive action, but it does surface an inconsistent, unstyled prompt instead of failing loudly.

## Related recipes

- [Delete a case safely (create stage vs. an existing work object)](./safe-case-deletion.md)
- [Handle a failed submit gracefully](./graceful-submit-failure.md)
