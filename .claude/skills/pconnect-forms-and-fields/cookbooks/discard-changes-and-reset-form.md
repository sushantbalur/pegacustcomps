---
title: Discard changes and reset a form to its pristine state
keywords: [discard changes, reset form, clear validation errors, cancel edit, revert]
primary_methods: [FormUtils.clearChangedProperties, FormUtils.resetComplexObjectDirtyStatus]
related: [collect-form-changes-for-manual-save, full-form-validation]
---

# Recipe: Discard changes and reset a form to its pristine state

> Part of the [Forms & Field Behavior cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A "Discard changes" / "Cancel edit" affordance needs to clear the form's changed-properties tracking and dirty-status flags so the form no longer reports unsaved changes, without a full page reload.

## Solution

Uses `FormUtils` (via `PCore.getFormUtils()`, see [pcore-misc-details.md](../../references/pcore-misc-details.md)).

```typescript
function onDiscardChangesClick(context) {
  const { clearChangedProperties, resetComplexObjectDirtyStatus } = PCore.getFormUtils();

  clearChangedProperties(context);
  resetComplexObjectDirtyStatus(context);

  // Field values themselves are not reset by either call — reload/re-fetch the underlying
  // page/case data if the visible field values must also revert to their last-saved values.
}
```

## Discussion

**MUST NOT** assume `clearChangedProperties`/`resetComplexObjectDirtyStatus` revert field values — they only clear the _tracking_ of what changed and whether a complex object is dirty. If the UI must show the last-saved values again, re-fetch or restore them separately (for example, by re-opening the assignment).

**SHOULD** call both together when fully resetting a form's dirty state — `clearChangedProperties` covers simple properties, while `resetComplexObjectDirtyStatus` covers the dirty flag on nested/complex objects; using only one can leave the other half of the form still reporting as dirty.

## Related recipes

- [Collect changed or submittable form data for a manual save action](./collect-form-changes-for-manual-save.md)
- [Validate an entire form before allowing submit](./full-form-validation.md)
