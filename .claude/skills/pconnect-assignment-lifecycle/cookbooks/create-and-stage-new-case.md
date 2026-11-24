---
title: Create a new case and jump directly to a target stage
keywords: [create case, new case wizard, skip stage, jump to stage, case creation]
primary_methods: [ActionsApi.createWork, ActionsApi.openStage, ActionsApi.finishAssignment]
related: [multi-step-wizard, modal-assignment-submit]
---

# Recipe: Create a new case and jump directly to a target stage

> Part of the [Assignment & Submission Lifecycle cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A "create case" affordance needs to create the case with some starting field values already known (for example, a case created from a picklist selection), then skip straight to a later stage instead of showing the case's default first stage.

## Solution

Uses [`ActionsApi`](../../references/pconnect-actions-api.md).

```typescript
async function createCaseAtStage(className, startingFields, targetStageID) {
  await pConn.getActionsApi().createWork(className, {
    containerName: 'primary',
    startingFields
  });

  // Only call openStage if the target stage differs from the case's default starting stage.
  await pConn.getActionsApi().openStage(targetStageID);
}

async function finishCurrentStageAssignment(containerItemID) {
  await pConn.getActionsApi().finishAssignment(containerItemID);
}
```

## Discussion

**MUST NOT** assume `createWork` alone lands the user on the desired stage — it always opens the case's configured first assignment. Call `openStage` afterward only when the target stage is known to differ from that default; calling it unconditionally on every creation adds a redundant navigation round trip.

**MUST** treat `openStage` as a navigation call only — it does not submit or skip validation for stages in between. Any stage-entry data still needs to be collected and submitted through its own assignment(s).

## Related recipes

- [Multi-step wizard navigation with per-step save and final submit](./multi-step-wizard.md)
- [Open an assignment in a modal, edit, validate, submit, and close](./modal-assignment-submit.md)
