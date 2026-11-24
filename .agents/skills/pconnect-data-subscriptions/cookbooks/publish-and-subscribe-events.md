---
title: Publish a custom application-wide event for other components to react to
keywords: [event bus, publish, custom event, cross-component communication, broadcast]
primary_methods: [PubSubUtils.publish, PubSubUtils.subscribeOnce]
related: [pubsub-cleanup]
---

# Recipe: Publish a custom application-wide event for other components to react to

> Part of the [Data Subscriptions & Real-time cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A component completes an action (for example, "review submitted") that several unrelated components elsewhere in the page need to react to, without wiring them together directly through props or a shared parent.

## Solution

Uses `PCore.getPubSubUtils()` (see [pcore-messaging-details.md](../../references/pcore-messaging-details.md)). This is the publisher side of the pattern documented from the subscriber side in [Publish/subscribe between unrelated components, with cleanup](./pubsub-cleanup.md).

```typescript
const CUSTOM_EVENT = 'my-app:review-submitted';

// Publisher — fires after the action completes.
function onReviewSubmitted(caseID) {
  PCore.getPubSubUtils().publish(CUSTOM_EVENT, { caseID });
}

// A subscriber that only needs to react the next time this happens, not every time.
PCore.getPubSubUtils().subscribeOnce(CUSTOM_EVENT, ({ caseID }) => refreshSummaryPanel(caseID), 'summary-panel-once');
```

## Discussion

**SHOULD** namespace custom event names (for example, `my-app:review-submitted`) rather than a bare string like `reviewSubmitted` — `PubSubUtils` is a single, application-wide bus shared by every component, and an unnamespaced string can collide with another component's event.

**MUST** use `subscribeOnce` (not `subscribe` followed by a manual `unsubscribe` inside the handler) when a listener genuinely only needs to fire one time — it self-removes after the first invocation, which is easy to get wrong by hand.

## Related recipes

- [Publish/subscribe between unrelated components, with cleanup](./pubsub-cleanup.md)
