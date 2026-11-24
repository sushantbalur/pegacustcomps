---
title: Subscribe to a data page and clean up on unmount
keywords: [data page, polling, server push, memory leak, unmount, useEffect cleanup]
primary_methods: [DataPageUtils.subscribeToDataPageUpdates, DataPageUtils.unsubscribeToDataPageUpdates]
related: [pubsub-cleanup, cascading-dependent-fields, autosave-tracking]
---

# Recipe: Subscribe to a data page and clean up on unmount

> Part of the [Data Subscriptions & Real-time cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A component needs to react to server-pushed updates to a data page, without leaking a subscription after the component unmounts.

## Solution

Uses `PCore.getDataPageUtils()` (see [pcore-rest-data-details.md](../../references/pcore-rest-data-details.md)) inside a component lifecycle.

```typescript
useEffect(() => {
  const subscriptionId = 'my-component-subscription';

  PCore.getDataPageUtils().subscribeToDataPageUpdates(subscriptionId, onDataPageUpdate, 'D_Cases');

  return () => {
    // Always unsubscribe on unmount — an orphaned subscription keeps firing after the component is gone.
    PCore.getDataPageUtils().unsubscribeToDataPageUpdates(subscriptionId, 'D_Cases');
  };
}, []);
```

## Discussion

**MUST** use the exact same `subscriptionId` and `dataPageName` pair for both subscribe and unsubscribe. **NEVER** let them drift apart — a mismatch makes the unsubscribe silently no-op, and the original callback keeps firing.

## Related recipes

- [Publish/subscribe between unrelated components, with cleanup](./pubsub-cleanup.md)
- [Register cascading/dependent fields and clean them up](../../pconnect-forms-and-fields/cookbooks/cascading-dependent-fields.md)
- [Track autosave status while editing a form](../../pconnect-forms-and-fields/cookbooks/autosave-tracking.md)
