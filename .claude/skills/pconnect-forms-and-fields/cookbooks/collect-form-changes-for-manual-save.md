---
title: Collect changed or submittable form data for a manual save action
keywords: [manual save, save draft, changed fields, submit payload, custom save button]
primary_methods: [FormUtils.getChanges, FormUtils.getSubmitData]
related: [autosave-tracking, full-form-validation]
---

# Recipe: Collect changed or submittable form data for a manual save action

> Part of the [Forms & Field Behavior cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A custom "Save Draft" button — distinct from both autosave and the final assignment submit — needs to package up either just the fields the user changed, or the full submittable payload, to send to a custom endpoint.

## Solution

Uses `FormUtils` (via `PCore.getFormUtils()`, see [pcore-misc-details.md](../../references/pcore-misc-details.md)).

```typescript
const { getChanges, getSubmitData } = PCore.getFormUtils();

function onSaveDraftClick(context) {
  // Only the properties the user actually touched since the last save.
  const changedFields = getChanges(context);
  return saveDraftToCustomEndpoint(changedFields);
}

function onSaveFullSnapshotClick(context) {
  // The complete submittable payload, as if the form were being submitted now.
  const fullPayload = getSubmitData(context, { onlyChangedData: false });
  return saveDraftToCustomEndpoint(fullPayload);
}
```

## Discussion

**MUST** choose `getChanges` vs. `getSubmitData({ onlyChangedData: true })` deliberately rather than interchangeably — `getChanges` returns the raw changed-properties list, while `getSubmitData` shapes the data the way an actual submit would, including any fields the form's own submit-time logic would add. Prefer `getSubmitData` when the draft will later be replayed through the same submit path.

**SHOULD** pass `{ includeDisabledFields: false }` (the default) unless the custom save endpoint specifically needs disabled-field values — including them can leak data the user never had a chance to edit or even see.

## Related recipes

- [Track autosave status while editing a form](./autosave-tracking.md)
- [Validate an entire form before allowing submit](./full-form-validation.md)
