---
title: Track autosave status while editing a form
keywords: [autosave, draft, in-progress edits, save indicator]
primary_methods:
  [AutosaveUtils.isAutosaveEnabledForContext, AutosaveUtils.subscribeAutosaveStatus, AutosaveUtils.notifyChange]
related: [data-page-subscription-cleanup, full-form-validation]
---

# Recipe: Track autosave status while editing a form

> Part of the [Forms & Field Behavior cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A component needs to show an autosave indicator and tell the autosave engine about in-progress edits, without leaking the status subscription after unmount.

## Solution

Uses `AutosaveUtils` (via `PCore.getAutosaveUtils()`, see [pcore-misc-details.md](../../references/pcore-misc-details.md)).

```typescript
useEffect(() => {
  if (!PCore.getAutosaveUtils().isAutosaveEnabledForContext(context)) return undefined;

  const unsubscribe = PCore.getAutosaveUtils().subscribeAutosaveStatus(itemKey, (status) => {
    setAutosaveStatus(status);
  });

  return unsubscribe;
}, [context, itemKey]);

const onFieldChange = (propReference, value) => {
  // Tell the autosave engine about the edit so it can debounce/save it, separately from field-level state.
  PCore.getAutosaveUtils().notifyChange(context, propReference, value);
};
```

## Discussion

**MUST** check `isAutosaveEnabledForContext` before subscribing. **NEVER** subscribe unconditionally — it wires up a listener that never fires on a context where autosave is off, which is a silent no-op that's easy to mistake for a bug elsewhere.

## Related recipes

- [Subscribe to a data page and clean up on unmount](../../pconnect-data-subscriptions/cookbooks/data-page-subscription-cleanup.md)
- [Validate an entire form before allowing submit](./full-form-validation.md)
