---
title: Validate an entire form before allowing submit
keywords: [validate all fields, disable submit button, dirty check, unsaved changes]
primary_methods: [FormUtils.isFormValid, FormUtils.isStateModified, ActionsApi.finishAssignment]
related: [modal-assignment-submit, multi-step-wizard, autosave-tracking]
---

# Recipe: Validate an entire form before allowing submit

> Part of the [Forms & Field Behavior cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A Submit button must stay disabled until every field on the view is valid and the user has actually changed something — not just one field, as in the modal recipe.

## Solution

Uses `PCore.getFormUtils()` (see [pcore-misc-details.md](../../references/pcore-misc-details.md)) together with [`ActionsApi`](../../references/pconnect-actions-api.md).

```typescript
const canSubmit = PCore.getFormUtils().isFormValid(context) && PCore.getFormUtils().isStateModified(context);

if (canSubmit) {
  await pConn.getActionsApi().finishAssignment(containerItemID);
} else {
  // Keep the Submit button disabled; individual field errors are already shown by the framework.
}
```

## Discussion

**MUST** combine `isStateModified` with `isFormValid` — checking validity alone allows submitting an assignment the user never actually changed.

## Related recipes

- [Open an assignment in a modal, edit, validate, submit, and close](../../pconnect-assignment-lifecycle/cookbooks/modal-assignment-submit.md)
- [Multi-step wizard navigation with per-step save and final submit](../../pconnect-assignment-lifecycle/cookbooks/multi-step-wizard.md)
- [Track autosave status while editing a form](./autosave-tracking.md)
