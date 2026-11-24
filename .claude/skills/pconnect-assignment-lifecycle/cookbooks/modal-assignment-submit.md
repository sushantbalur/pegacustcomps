---
title: Open an assignment in a modal, edit, validate, submit, and close
keywords: [modal, dialog, submit, close, validate before submit, containerItemID]
primary_methods:
  [
    ContainerManager.addContainerItem,
    ActionsApi.openAssignment,
    ValidationApi.validateEmail,
    ActionsApi.finishAssignment,
    ContainerManager.removeContainerItem
  ]
related: [full-form-validation, multi-step-wizard, graceful-submit-failure, safe-case-deletion]
---

# Recipe: Open an assignment in a modal, edit, validate, submit, and close

> Part of the [Assignment & Submission Lifecycle cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

An assignment needs to open in a modal region, let the user edit a field, and only submit (and close the modal) once that field is valid.

## Solution

Uses [`ContainerManager`](../../references/pconnect-container-manager.md), [`ValidationApi`](../../references/pconnect-validation-api.md), and [`ActionsApi`](../../references/pconnect-actions-api.md).

```typescript
const containerManager = pConn.getContainerManager();

// 1. Add a container item to host the assignment in a modal region. addContainerItem's promise
// resolves with null, not the container item — pass an explicit ID so it can be reused below.
const containerItemID = `modalAssignment_${assignmentID}`;
await containerManager.addContainerItem({ containerItemID, context, semanticURL: '' });

// 2. Load the assignment into that container item.
await pConn.getActionsApi().openAssignment(assignmentID, className, { containerName: 'modal' });

// 3. Validate a field before allowing submission.
const emailCheck = pConn.getValidationApi().validateEmail(emailValue);
if (emailCheck.status === 'failure') {
  // Surface emailCheck.message next to the field and stop here.
} else {
  // 4. Submit and close the modal.
  await pConn.getActionsApi().finishAssignment(containerItemID);
  await containerManager.removeContainerItem({ containerItemID });
}
```

## Discussion

**MUST:** call `finishAssignment` before `removeContainerItem`. `finishAssignment` submits server-side; NEVER remove the container item first — doing so closes the modal before you know whether the submission succeeded.

## Related recipes

- [Validate an entire form before allowing submit](../../pconnect-forms-and-fields/cookbooks/full-form-validation.md)
- [Multi-step wizard navigation with per-step save and final submit](./multi-step-wizard.md)
- [Handle a failed submit gracefully](./graceful-submit-failure.md)
- [Delete a case safely (create stage vs. an existing work object)](./safe-case-deletion.md)
