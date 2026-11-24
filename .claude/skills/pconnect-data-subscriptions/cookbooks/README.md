---
title: Data Subscriptions & Real-time Cookbook — Recipe Index
description: Multi-method recipes for data page subscriptions, pub/sub, and real-time case updates, indexed by symptom/keyword and primary method for AI/RAG retrieval.
---

# Cookbook: Data Subscriptions & Real-time

> Part of the [Data Subscriptions & Real-time skill](../SKILL.md).

Every file in [`../../references/`](../../references/) documents one method at a time. Each file in this folder shows how to **chain multiple documented methods together** to complete one common real-world task. Every recipe only uses methods already cataloged in `references/` — follow the links in each recipe for full signatures. Nothing here invents a new API; every call is a direct composition of already-documented methods.

Each recipe is a single, self-contained file with:

- YAML frontmatter (`keywords`, `primary_methods`, `related`) for structured/metadata search.
- A **Problem** statement — what you're trying to accomplish, in plain language.
- A **Solution** — the minimal correct code, linking to the individual reference files for each method used.
- A **Discussion** — the ordering/cleanup/gotcha pitfall that makes this worth documenting as a recipe instead of assembling from scratch.
- **Related recipes** — links to recipes that share a pattern (lifecycle, cleanup, error handling, etc.), including recipes in sibling skills.

## Recipe Index

Search by symptom or keyword before assembling a sequence of calls from scratch — there is a good chance the ordering/cleanup pitfalls have already been worked out below.

| Recipe                                                                         | Keywords                                                                       | Primary methods           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------- |
| [Data page subscription cleanup](./data-page-subscription-cleanup.md)          | data page, polling, server push, memory leak, unmount, useEffect cleanup       | `DataPageUtils`           |
| [Pub/sub cleanup](./pubsub-cleanup.md)                                         | event bus, publish, subscribe, cross-component communication, orphaned handler | `PubSubUtils`, `Events`   |
| [Real-time case update subscription](./realtime-case-subscription.md)          | WebSocket, server push, real-time update, live case status, messaging service  | `MessagingServiceManager` |
| [Publish a custom application-wide event](./publish-and-subscribe-events.md)   | event bus, publish, custom event, cross-component communication, broadcast     | `PubSubUtils`             |
| [Force-refresh a stale cached data page](./refresh-and-update-data.md)         | refresh, stale cache, cache invalidation, force reload, refresh button         | `DataPageUtils`           |
| [Query a paginated, filterable list data view](./query-paginated-list-data.md) | list query, pagination, filter, sort, data view, search results                | `DataApiUtils`            |

Use the individual reference files in [`../../references/`](../../references/) to look up a single method's exact signature. Use a recipe here when you need to know the **order** multiple methods should be called in to complete a task.

As more cookbooks are added, add one file per recipe (not more content to an existing recipe file) and a row here — see any existing recipe file for the expected frontmatter/structure.
