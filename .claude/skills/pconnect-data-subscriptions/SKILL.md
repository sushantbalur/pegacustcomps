---
name: pconnect-data-subscriptions
description: 'Reference catalog and cookbook for PCore/PConnect APIs governing data subscriptions and real-time updates — DataPageUtils, PubSubUtils, Events, MessagingServiceManager, and DataApiUtils — with recipes for subscribing to a data page with cleanup, publish/subscribe between unrelated components, subscribing to real-time server-pushed case updates, publishing a custom application-wide event, force-refreshing a stale cached data page, and querying a paginated/filterable list data view. Use when you need the exact signature for these APIs, or the correct subscribe/unsubscribe sequence to avoid orphaned handlers.'
user-invocable: true
argument-hint: 'Use when subscribing to a data page, publishing/subscribing between components, or reacting to real-time server-pushed case updates — for the exact DataPageUtils/PubSubUtils/MessagingServiceManager signature, or the correct subscribe/unsubscribe order.'
metadata:
  verified-against: 'latest 26.x'
---

# Data Subscriptions & Real-time — PCore/PConnect Skill

This skill covers the PCore/PConnect APIs and recipes for **data subscriptions and real-time updates**: data page subscriptions, application-wide pub/sub between unrelated components, and server-pushed real-time case updates. It is one of the PCore/PConnect API skills — see the [skills index](../README.md) for the full method catalog, architecture primer, and the other five skills.

## When to Use This Skill

Load this skill when:

- You need the exact parameters, return type, or purpose of a `DataPageUtils`, `PubSubUtils`, `Events`, or `MessagingServiceManager` method.
- You're subscribing a component to a data page, an application-wide event, or a server-pushed WebSocket message, and need to avoid an orphaned subscription after unmount.
- You're unsure whether to use `PubSubUtils` (same-tab, locally published events) or `MessagingServiceManager` (server-pushed, cross-session updates).

If your task is about cascading one field from another (which also uses a subscribe/unsubscribe pattern, via `CascadeManager`), see [pconnect-forms-and-fields](../pconnect-forms-and-fields/SKILL.md) instead.

New to PCore/PConnect? Start with [Architecture at a Glance](../references/architecture-overview.md).

## Key Reference Files

| File                                                                                     | Class(es)                                                            | Obtained via   |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------- |
| [../references/pcore-rest-data-details.md](../references/pcore-rest-data-details.md)     | `DataPageUtils`, `DataApi`, `DataApiUtils`                           | `PCore.get*()` |
| [../references/pcore-messaging-details.md](../references/pcore-messaging-details.md)     | `PubSubUtils`, `Events`, `MessagingServiceManager`, `MessageManager` | `PCore.get*()` |
| [../references/pcore-rest-data-messaging.md](../references/pcore-rest-data-messaging.md) | REST client, data pages/views, cascade, messaging, refresh           | `PCore.get*()` |

See the [full reference index](../README.md) for every other PCore/PConnect method not directly related to this skill's topic.

## Cookbooks

Multi-method, ordering/cleanup recipes for this skill's topic live in [cookbooks/README.md](./cookbooks/README.md): subscribing to a data page with cleanup, publish/subscribe between unrelated components, real-time server-pushed case update subscriptions, publishing a custom application-wide event, force-refreshing a stale cached data page, and querying a paginated/filterable list data view.

Use the reference files above for a single method's signature. Use the cookbook index when you need the **order** multiple methods should be called in to complete a task.

For testing subscribe/unsubscribe behavior, security considerations, performance (avoiding redundant subscriptions, canceling stale requests), resiliency when offline, accessibly announcing server-pushed updates, or troubleshooting a subscription that keeps firing after unmount, see [Cross-Cutting Best Practices](../best-practices/README.md).
