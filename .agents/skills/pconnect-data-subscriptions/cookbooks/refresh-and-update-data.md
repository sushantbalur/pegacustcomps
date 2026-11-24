---
title: Force-refresh a stale cached data page on demand
keywords: [refresh, stale cache, cache invalidation, force reload, refresh button]
primary_methods: [DataPageUtils.markDataInstanceDirty, DataPageUtils.getDataAsync]
related: [data-page-subscription-cleanup]
---

# Recipe: Force-refresh a stale cached data page on demand

> Part of the [Data Subscriptions & Real-time cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A component caches a data page result, but the user clicks an explicit "Refresh" affordance (or the component knows the underlying data changed some other way) and needs the next read to hit the server instead of returning the cached value.

## Solution

Uses `PCore.getDataPageUtils()` (see [pcore-rest-data-details.md](../../references/pcore-rest-data-details.md)).

```typescript
async function onRefreshClick(dataPageName, parameters, context) {
  const { markDataInstanceDirty, getDataAsync } = PCore.getDataPageUtils();

  // Marks the cached instance stale; it does NOT itself trigger a re-fetch.
  markDataInstanceDirty(dataPageName, parameters);

  // The next getDataAsync call — with the same parameters — now goes to the server instead of the cache.
  const refreshed = await getDataAsync(dataPageName, context, parameters);
  return refreshed;
}
```

## Discussion

**MUST** call `getDataAsync` (or otherwise re-request the page) after `markDataInstanceDirty` — marking a page dirty does not by itself cause any subscriber to re-render with new data; it only changes what the _next_ fetch returns.

**MUST** pass the exact same `parameters` to `markDataInstanceDirty` and the follow-up `getDataAsync` call — the cache key includes parameters, so marking one parameter combination dirty does not invalidate a differently-parameterized cached instance of the same data page.

## Related recipes

- [Subscribe to a data page and clean up on unmount](./data-page-subscription-cleanup.md)
