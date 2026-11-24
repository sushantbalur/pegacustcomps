---
title: Approve or reject a case in an approval step
keywords: [approval, reject, approve case, sign-off, decision step]
primary_methods: [ActionsApi.approveCase, ActionsApi.rejectCase]
related: [confirm-before-destructive-action, graceful-submit-failure]
---

# Recipe: Approve or reject a case in an approval step

> Part of the [Assignment & Submission Lifecycle cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

An approval assignment presents two outcomes — approve or reject — and the reject path should ask for confirmation first since it is harder to walk back than an approval.

## Solution

Uses [`ActionsApi`](../../references/pconnect-actions-api.md) and, for the confirmation step, [`ConfirmDialogService`](../../references/pcore-misc-details.md).

```typescript
async function approve(containerItemID) {
  // approveCase both records the decision and finishes the assignment — do not call finishAssignment afterward.
  await pConn.getActionsApi().approveCase(containerItemID);
}

async function rejectWithConfirmation(containerItemID) {
  const confirmed = await PCore.getConfirmDialogService().confirm(
    'This case will be sent back and cannot be re-approved from this step. Continue?'
  );

  if (!confirmed) return;

  // rejectCase also finishes the assignment on its own.
  await pConn.getActionsApi().rejectCase(containerItemID);
}
```

## Discussion

**MUST NOT** call `finishAssignment` after `approveCase`/`rejectCase` — both methods already finish the assignment as part of recording the decision; calling `finishAssignment` again submits an already-finished assignment.

**SHOULD** gate the reject path behind an explicit confirmation (see [Custom confirm before a destructive action](./confirm-before-destructive-action.md)) since rejection is typically harder to reverse than approval, but treat this as a UX choice, not a requirement of the API itself — the API applies no such distinction.

## Related recipes

- [Custom confirm before a destructive action](./confirm-before-destructive-action.md)
- [Graceful submit failure handling](./graceful-submit-failure.md)
