---
title: Delete a case safely (create stage vs. an existing work object)
keywords: [delete case, cancel case, remove work object, create stage]
primary_methods: [ActionsApi.deleteCaseInCreateStage, ActionsApi.deleteWork]
related: [modal-assignment-submit]
---

# Recipe: Delete a case safely (create stage vs. an existing work object)

> Part of the [Assignment & Submission Lifecycle cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A case needs to be deleted, but which `ActionsApi` method to call depends on whether the case has already left its create stage.

## Solution

Uses [`ActionsApi`](../../references/pconnect-actions-api.md).

```typescript
if (isInCreateStage) {
  // The case has no confirmed ID yet — use the create-stage-specific delete.
  await pConn.getActionsApi().deleteCaseInCreateStage(containerItemID);
} else {
  // The case is already persisted — use deleteWork, which shows a confirmation dialog by default.
  await pConn.getActionsApi().deleteWork(workId, caseTypeID);
}
```

## Discussion

**NEVER** call `deleteWork` on a case still in its create stage, or `deleteCaseInCreateStage` on an already-persisted case — there is no single `deleteCase()` method that handles both, and calling the wrong one for the case's stage is a common mistake.

## Related recipes

- [Open an assignment in a modal, edit, validate, submit, and close](./modal-assignment-submit.md)
