---
title: Query a paginated, filterable list data view
keywords: [list query, pagination, filter, sort, data view, search results]
primary_methods: [DataApiUtils.getData, DataApiUtils.getListCount, DataApiUtils.getDataViewMetadata]
related: [refresh-and-update-data]
---

# Recipe: Query a paginated, filterable list data view

> Part of the [Data Subscriptions & Real-time cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A grid/table needs to fetch a page of results from a list data view with filters and sorting applied, show a total record count for the pager, and know which columns are filterable/sortable ahead of rendering filter controls.

## Solution

Uses `PCore.getDataApiUtils()` (see [pcore-rest-data-details.md](../../references/pcore-rest-data-details.md)).

```typescript
const { getData, getListCount, getDataViewMetadata } = PCore.getDataApiUtils();

// Render filter controls from the data view's own field metadata rather than hardcoding column config.
const metadata = await getDataViewMetadata('D_CaseSearchResults', context);

const payload = {
  paging: { pageSize: 20, pageNumber: 1 },
  sortBy: [{ field: 'pxCreateDateTime', direction: 'DESC' }],
  filters: [{ field: 'pyStatusWork', operator: 'IN', values: ['Open'] }]
};

const { data } = await getData('D_CaseSearchResults', payload, context);
const { data: count } = await getListCount('D_CaseSearchResults', payload, context);
```

## Discussion

**SHOULD** call `getDataViewMetadata` once (and cache the result) to discover which fields are actually queryable/sortable, rather than assuming every visible column supports server-side filtering — an unsupported filter field is silently ignored by some data views rather than raising an error.

**MUST** pass the identical `payload` (filters and paging) to both `getData` and `getListCount` — a mismatched payload returns a total count that doesn't correspond to the rows actually shown, breaking the pager.

## Related recipes

- [Force-refresh a stale cached data page on demand](./refresh-and-update-data.md)
