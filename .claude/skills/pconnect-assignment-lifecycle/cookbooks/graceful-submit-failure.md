---
title: Handle a failed submit gracefully
keywords: [error handling, failed submit, generic error message, rollback]
primary_methods: [ErrorHandler.setGenericFailedMessage, ActionsApi.finishAssignment, FormUtils.getChanges]
related: [modal-assignment-submit, attachment-upload]
---

# Recipe: Handle a failed submit gracefully

> Part of the [Assignment & Submission Lifecycle cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A submit call can fail server-side, and the user's in-progress edits must not be lost or silently discarded when that happens.

## Solution

Uses `ErrorHandler` and `FormUtils` (both via `PCore.get*()`, see [pcore-misc-details.md](../../references/pcore-misc-details.md)) together with [`ActionsApi`](../../references/pconnect-actions-api.md).

```typescript
PCore.getErrorHandler().setGenericFailedMessage('We could not save your changes. Please try again.');

try {
  await pConn.getActionsApi().finishAssignment(containerItemID);
} catch (error) {
  // The assignment stays open and dirty — surface the changed fields so the user doesn't lose them.
  const changedFields = PCore.getFormUtils().getChanges(context);
  showRetryBanner(changedFields);
}
```

## Discussion

**NEVER** remove the container item or navigate away in the `catch` block — the whole point of leaving the assignment open is so the user's in-progress edits (tracked via `getChanges`) are not lost.

## Related recipes

- [Open an assignment in a modal, edit, validate, submit, and close](./modal-assignment-submit.md)
- [Upload a file, attach it to a case, and handle a failed upload](./attachment-upload.md)
