---
title: Performance & Efficiency
description: Debouncing, buffering, caching/invalidation, request cancellation, and subscription hygiene patterns for components that call PCore/PConnect APIs.
---

# Performance & Efficiency

> Part of [Cross-Cutting Best Practices](./README.md).

Most PCore/PConnect calls cross a network boundary, and several return values the framework already caches for you. The patterns below keep a custom component from doing unnecessary work — its own or the server's.

## Debounce or Buffer User-Triggered Calls

A field wired directly to `onChange` → REST/data-page call fires once per keystroke, which wastes network round trips and can make results arrive out of order (see [Troubleshooting: an older async response overwrites a newer one](./troubleshooting-common-pitfalls.md#an-older-async-response-overwrites-a-newer-one-a-fast-typed-search-shows-results-for-an-earlier-query)). Two documented options:

```typescript
// Option 1: a debounced Observable — react only after input goes quiet.
const debouncedSubject = PCore.getAsynchronousUtils().getDebouncedSubject(250);
const subscription = debouncedSubject.subscribe((value) => runSearch(value));
// ...on each keystroke: debouncedSubject.next(currentValue);
```

```typescript
// Option 2: buffered/batched fetches built into a live DataApi instance (typeahead-style fields).
const dataApiInstance = await PCore.getDataApi().init(dataConfig, contextName);
dataApiInstance.registerForBufferedCall({ waitTime: 50 });
const results = await dataApiInstance.fetchData(searchTerm);
```

See [pcore-misc-details.md](../references/pcore-misc-details.md) and [pcore-rest-data-details.md](../references/pcore-rest-data-details.md) for full signatures.

## Cache Data Pages, But Invalidate Deliberately

Data page reads (`DataPageUtils.getDataAsync`/`getPageDataAsync`, `DataApi.init`) are cached by the framework — calling them again with the same parameters typically reuses the cached result instead of re-fetching. That's a performance win, but it means a stale read is a common bug after a write:

- After a save/update that should be reflected on next read, call `DataPageUtils.markDataInstanceDirty(dataPageName, parameters)` or re-fetch with `{ invalidateCache: true }`.
- When a `DataApi` instance is scoped to a context that's going away (e.g. a container item closing), call `DataApi.clearContextedCache(context)` so the next open of that context doesn't reuse a stale cached instance.
- For small, component-local values (not full data page results), `NavigationUtils.getComponentCache`/`setComponentCache`/`resetComponentCache` (see [pcore-misc-details.md](../references/pcore-misc-details.md)) offer a lighter-weight, shorter-lived cache than a data page round trip.

Caching is only a net win if invalidation is deliberate — don't cache a value and then forget which write paths should invalidate it.

## Cancel Requests That Are No Longer Needed

If a component can trigger a new request before a previous one resolves (a search box, a fast-changing filter, an unmounting component), cancel the stale request instead of letting it complete and race the newer one:

```typescript
const { invokeRestApi, getCancelTokenSource, isRequestCanceled } = PCore.getRestClient();
const cancelTokenSource = getCancelTokenSource();

invokeRestApi(routeKey, { ...payload, cancelTokenSource }).catch((error) => {
  if (isRequestCanceled(error)) return; // expected — a newer request superseded this one
  handleRealError(error);
});

// When a newer request starts, or the component unmounts:
cancelTokenSource.cancel();
```

This isn't only about correctness (see [Error Handling & Resiliency: distinguish cancellation from failure](./error-handling-and-resiliency.md#distinguish-cancellation-from-failure)) — it also frees the response payload the server would otherwise still compute and send for a result nobody will use.

## Avoid Redundant Subscriptions

If multiple sibling components need the same data page or the same pub/sub event, prefer a single subscription owned by a shared ancestor/context over each sibling independently calling `subscribeToDataPageUpdates`/`PubSubUtils.subscribe`. Duplicate subscriptions mean duplicate network/server work for identical data, and duplicate cleanup surface area for the same bug class described in the troubleshooting guide's [subscription cleanup entry](./troubleshooting-common-pitfalls.md#subscription-callback-keeps-firing-after-the-component-unmounts).

## Minimize Store Reads in the Render Path

`StateUtils.getSharedState`/`ContextTreeManager.getFieldsList` (see [pcore-store-context-details.md](../references/pcore-store-context-details.md)) can return large structures. Read only the narrow piece of state a component actually renders, rather than pulling a broad object and destructuring it afterward — a narrower read makes it easier to reason about what a re-render actually depends on, and avoids re-rendering on changes to sibling state the component never displays.

## Batch Related List Operations

When applying the same change to many rows of a repeating structure, prefer `ListActions`' batch-capable operations (see [pconnect-list-actions.md](../references/pconnect-list-actions.md)) over looping and calling a single-row update once per row — a loop of individual calls multiplies both client-side dispatches and, depending on the operation, server round trips.

## Parallelize Independent Calls Instead of Awaiting Them One at a Time

If a component needs the results of two or more calls that don't depend on each other's output (for example, a data page lookup and a separate `AnalyticsUtils` call), issue them together with `Promise.all` rather than `await`-ing each in sequence. Sequential awaits of independent calls create an artificial waterfall — the total wait time becomes the sum of both round trips instead of the slower of the two:

```typescript
// Avoid: the second call doesn't start until the first one finishes, for no reason.
const lookupResult = await PCore.getDataPageUtils().getDataAsync(dataPage, contextName);
const insightIDs = await PCore.getAnalyticsUtils().getInsightIDs();

// Prefer: both requests are in flight at the same time.
const [lookupResult, insightIDs] = await Promise.all([
  PCore.getDataPageUtils().getDataAsync(dataPage, contextName),
  PCore.getAnalyticsUtils().getInsightIDs()
]);
```

Only sequence calls when the second genuinely depends on the first's resolved value (for example, using a fetched record's ID as a parameter to the next call).

## Virtualize Long Repeating Structures

Rendering every row of a large repeating structure or list view at once means the browser builds and lays out DOM nodes for rows the user can't currently see. For lists that can grow into the hundreds of rows, render only the visible window (plus a small overscan buffer) instead of the full data set — check whether the presentation component already used for the list (in `cosmos-core`/`dx-components`) has built-in virtualization support before building a custom windowing solution.

## Lazy-Load Assets That Aren't Needed on Initial Render

`AssetLoader.loadAssets(assets, options)`/`getSvcImage(key)`/`getSvcImageUrl(key)` (see [pcore-misc-details.md](../references/pcore-misc-details.md)) fetch assets on demand rather than requiring them to be bundled/loaded upfront. Prefer loading an image, icon set, or other optional asset only when the view that displays it actually renders (or becomes visible), instead of loading every asset a component might ever need at mount time — this matters most for content behind a tab, an accordion panel, or a modal that many users never open.

## Checklist

- Debounce or buffer any call wired to a fast-firing user input (typing, dragging, rapid toggles).
- After a write that affects a cached data page, invalidate it deliberately (`markDataInstanceDirty`/`invalidateCache`) rather than assuming the next read will be fresh.
- Cancel a request that a newer one has superseded, and check `isRequestCanceled` before treating its rejection as a real error.
- Share one subscription across siblings that need the same data instead of each subscribing independently.
- Read only the state slice a component renders, not a broad object it partially uses.
- Batch repeating-row operations instead of looping a single-row call.
- Run independent calls with `Promise.all` instead of awaiting them one after another.
- Virtualize (render only the visible window of) large repeating structures instead of every row at once.
- Lazy-load optional assets (`AssetLoader`) when the view that needs them renders, not unconditionally at mount.
