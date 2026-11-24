---
title: Publish/subscribe between unrelated components, with cleanup
keywords: [event bus, publish, subscribe, cross-component communication, orphaned handler]
primary_methods: [PubSubUtils.subscribe, PubSubUtils.unsubscribe, Events.getCaseEvent]
related: [data-page-subscription-cleanup, cascading-dependent-fields]
---

# Recipe: Publish/subscribe between unrelated components, with cleanup

> Part of the [Data Subscriptions & Real-time cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

Two components that don't share a parent/child relationship need to communicate through an application-wide event, without leaving a stale handler registered after either unmounts.

## Solution

Uses `PCore.getPubSubUtils()` (see [pcore-messaging-details.md](../../references/pcore-messaging-details.md)).

```typescript
useEffect(() => {
  const { subscribe, unsubscribe } = PCore.getPubSubUtils();
  const handlerName = 'my-widget-stage-listener';

  subscribe(PCore.getEvents().getCaseEvent().CREATE_STAGE_DONE, onStageCreated, handlerName);

  return () => unsubscribe(PCore.getEvents().getCaseEvent().CREATE_STAGE_DONE, handlerName);
}, []);
```

## Discussion

**MUST** use the same `name` for `subscribe`/`unsubscribe`. **NEVER** mismatch them (for example, unsubscribing with a different string) — doing so silently leaves the original handler active.

## Related recipes

- [Subscribe to a data page and clean up on unmount](./data-page-subscription-cleanup.md)
- [Register cascading/dependent fields and clean them up](../../pconnect-forms-and-fields/cookbooks/cascading-dependent-fields.md)
