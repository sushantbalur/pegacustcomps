---
title: Multi-step wizard navigation with per-step save and final submit
keywords: [stepper, process flow, next/previous, save between steps, finish on last step]
primary_methods: [ActionsApi.saveAssignment, ActionsApi.finishAssignment, ActionsApi.navigateToStep]
related: [modal-assignment-submit, full-form-validation]
---

# Recipe: Multi-step wizard navigation with per-step save and final submit

> Part of the [Assignment & Submission Lifecycle cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A multi-step process needs to persist each step's data as the user advances, but only actually submit the assignment on the final step.

## Solution

Uses [`ActionsApi`](../../references/pconnect-actions-api.md).

```typescript
async function goToNextStep(containerItemID, stepID, isLastStep) {
  // Persist the current step's data before moving on, without submitting the assignment.
  await pConn.getActionsApi().saveAssignment(containerItemID);

  if (isLastStep) {
    await pConn.getActionsApi().finishAssignment(containerItemID);
  } else {
    await pConn.getActionsApi().navigateToStep(stepID, containerItemID);
  }
}

async function goToPreviousStep(containerItemID) {
  await pConn.getActionsApi().navigateToStep('previous', containerItemID);
}
```

## Discussion

**NEVER** call `finishAssignment` on every step — it MUST only be called on the last step; intermediate steps MUST save (`saveAssignment`) without submitting.

## Related recipes

- [Open an assignment in a modal, edit, validate, submit, and close](./modal-assignment-submit.md)
- [Validate an entire form before allowing submit](../../pconnect-forms-and-fields/cookbooks/full-form-validation.md)
