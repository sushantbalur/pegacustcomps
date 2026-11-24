---
title: Subscribe to real-time case updates pushed from the server
keywords: [WebSocket, server push, real-time update, live case status, messaging service]
primary_methods:
  [MessagingServiceManager.subscribe, MessagingServiceManager.unsubscribe, MessagingServiceManager.getCaseSubscription]
related: [pubsub-cleanup, data-page-subscription-cleanup]
---

# Recipe: Subscribe to real-time case updates pushed from the server

> Part of the [Data Subscriptions & Real-time cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A component needs to reflect another user's changes to the same case in near-real-time (for example, a live "someone else updated this case" banner), which requires a server-pushed message rather than a purely local, same-tab event.

## Solution

Uses `MessagingServiceManager` (via `PCore.getMessagingServiceManager()`, see [pcore-messaging-details.md](../../references/pcore-messaging-details.md)).

```typescript
useEffect(() => {
  const manager = PCore.getMessagingServiceManager();

  // The filter is { matcher, criteria }: 'CASE' with the case ID selects server pushes for that case.
  // caseID is the case ID string (the same value as pConn.getCaseSummary().caseID; the typedef examples use
  // 'Approval-Request A-101'). Do not use getCaseSummary().ID: that is the assignment ID.
  const subscriptionId = manager.subscribe(
    { matcher: 'CASE', criteria: { caseId: caseID } },
    (payload: unknown) => showLiveUpdateBanner(payload),
    pConn.getContextName()
  );

  // subscribe returns the subscription id (a string), not an unsubscribe function.
  return () => manager.unsubscribe(subscriptionId);
}, [caseID]);
```

## Discussion

`MessagingServiceManager` is a distinct transport from `PubSubUtils`: this `subscribe` reacts to server-pushed WebSocket messages describing changes made in other sessions, while `PubSubUtils.subscribe` (see [Publish/subscribe between unrelated components](./pubsub-cleanup.md)) only reacts to events published locally within the same browser tab. **NEVER** expect `PubSubUtils` to notice another user's edit. **MUST** apply the same unsubscribe-on-unmount discipline here — an orphaned `MessagingServiceManager` subscription keeps a live socket handler registered for a component that no longer exists.

## Related recipes

- [Publish/subscribe between unrelated components, with cleanup](./pubsub-cleanup.md)
- [Subscribe to a data page and clean up on unmount](./data-page-subscription-cleanup.md)
