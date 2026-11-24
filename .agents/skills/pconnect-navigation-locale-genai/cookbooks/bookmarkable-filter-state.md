---
title: Keep filter and sort state bookmarkable in the URL
keywords: [bookmarkable filters, URL state, query parameters, shareable filtered view, filter persistence]
primary_methods: [NavigationUtils.getURLParam, NavigationUtils.setURLParam]
related: [deep-link-semantic-url]
---

# Recipe: Keep filter and sort state bookmarkable in the URL

> Part of the [Navigation, Locale & GenAI cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A list/grid's filter and sort selections should be reflected in the URL's query parameters, so a user can bookmark or share the exact filtered view with a colleague — distinct from [building a semantic deep link to a case or assignment](./deep-link-semantic-url.md), which targets a specific record rather than a filter state.

## Solution

Uses `NavigationUtils` (via `PCore.getNavigationUtils()`, see [pcore-misc-details.md](../../references/pcore-misc-details.md)).

```typescript
const { getURLParam, setURLParam } = PCore.getNavigationUtils();

// On initial render, restore filters from the URL if present.
const initialStatus = getURLParam('status', true) ?? 'all';

function onFilterChange(newStatus) {
  setURLParam('status', newStatus, true);
  applyFilter(newStatus);
}
```

## Discussion

**MUST** pass matching `decode`/`encode` flags on the read and write sides — a value written with `encode: true` but read back with `decode: false` (or vice versa) can produce a mismatched or double-encoded value for filter text containing special characters (spaces, `&`, `#`).

**SHOULD** keep this pattern limited to shallow, display-only filter/sort state — for identifying a specific record to reopen, use [Build a shareable deep link to a specific case or assignment](./deep-link-semantic-url.md) and its semantic-URL route keys instead, since those are recognized by Constellation's own router on reload and plain query parameters are not.

## Related recipes

- [Build a shareable deep link to a specific case or assignment](./deep-link-semantic-url.md)
