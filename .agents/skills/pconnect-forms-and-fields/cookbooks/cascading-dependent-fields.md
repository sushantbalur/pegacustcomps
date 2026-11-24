---
title: Register cascading/dependent fields and clean them up
keywords: [dependent dropdown, country/state, cascade, dynamic field reset]
primary_methods: [CascadeManager.registerFields, CascadeManager.unRegisterFields]
related: [data-page-subscription-cleanup, pubsub-cleanup]
---

# Recipe: Register cascading/dependent fields and clean them up

> Part of the [Forms & Field Behavior cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

Changing one field (for example, Country) needs to reset or reload a dependent field (for example, State), and the listener must not keep firing after the component unmounts.

## Solution

Uses `PCore.getCascadeManager()` (see [pcore-rest-data-messaging.md](../../references/pcore-rest-data-messaging.md)).

```typescript
useEffect(() => {
  const context = pConn.getContextName();
  const pageReference = pConn.getPageReference();
  const subscriberId = 'country-state-cascade';
  // Register the field being WATCHED (the one whose change should trigger the reload), not the dependent field.
  const watchedProps = ['.Country'];

  const onCountryChanged = () => {
    pConn.getActionsApi().updateFieldValue('.State', ''); // clear the dependent value
    reloadStateOptions(); // load the options for the new country
  };

  PCore.getCascadeManager().registerFields(context, pageReference, watchedProps, onCountryChanged, subscriberId);

  return () => {
    // Always pair registerFields with unRegisterFields, or the callback keeps firing after unmount.
    PCore.getCascadeManager().unRegisterFields(context, pageReference, watchedProps, subscriberId);
  };
}, []);
```

The typedef's own example registers field names without a leading dot (`['firstName', 'lastName']`) with an explicit page reference (`'caseInfo.content'`). Use the form your runtime resolves and confirm it in a running app; the call compiles either way.

## Discussion

**MUST** pass the exact same `context`, `pageReference`, `watchedProps`, and `subscriberId` to both `registerFields` and `unRegisterFields`. **NEVER** let them drift apart — a mismatch silently fails the cleanup, and the original callback keeps firing after unmount.

## Related recipes

- [Subscribe to a data page and clean up on unmount](../../pconnect-data-subscriptions/cookbooks/data-page-subscription-cleanup.md)
- [Publish/subscribe between unrelated components, with cleanup](../../pconnect-data-subscriptions/cookbooks/pubsub-cleanup.md)
