---
title: Troubleshooting Common Pitfalls
description: Symptom-indexed guide to the handful of mistakes that recur across all the PCore/PConnect skills — search by what's going wrong, not by method name.
---

# Troubleshooting Common Pitfalls

> Part of [Cross-Cutting Best Practices](./README.md).

The reference files document what each method does; this guide documents what tends to go wrong even when a method is called correctly according to its signature. Search this page by symptom before assuming a method is broken or under-documented.

## Systematic Diagnosis Checklist

Before assuming a documented method is broken, work through this order — most "the API doesn't work" reports turn out to be one of these:

1. **Check the browser console for the actual error.** A `TypeError`, a rejected-promise stack, or a validation warning almost always names the real problem more precisely than the symptom you started with.
2. **Re-read the exact signature in the relevant `references/` file.** A missing/misordered required parameter is the single most common root cause — verify argument order and required vs. optional parameters before suspecting the method itself.
3. **Confirm the method exists in the version you're running against.** If it's a recently-documented method, check whether the runtime/mock you're testing against is old enough to not implement it yet (see the entry below on this exact symptom).
4. **Check subscribe/unsubscribe and async ordering.** A large share of "state is stale" or "still running after unmount" bugs are a missing cleanup or an out-of-order async resolution, not a wrong method call — see the dedicated entries below.
5. **If it's failing only in a test, check the mock, not the component.** A test mock can drift out of sync with the real method's shape; confirm the failure reproduces against the real API (or a fresh mock built directly from the reference file) before debugging the component itself.

## `TypeError: pConn.someMethod is not a function` (or the same for `PCore.someMethod`)

**Cause:** the method exists in a newer platform version than the one the current mock, test, or runtime is on. This is especially common right after a new `PConnect`/`PCore` method is added — existing Jest mocks of `pConn`/`PCore` across the codebase don't automatically gain new methods.

**Fix:** call new/optional methods with optional chaining, `pConn.someMethod?.()`, rather than assuming every method is always present. Don't remove the optional chaining just because it works locally — other call sites or older mocks may not implement the method yet.

## `MessageManager.clearMessages(...)` runs without error, but the message is still shown

**Cause:** `type` was omitted from the options object. The underlying filter only removes messages whose `type` matches what you passed — omitting it means nothing matches, so nothing is removed, silently.

**Fix:** always pass the `type` that matches the message you're clearing (for example, `'error'`), alongside `category`/`context`, when calling `PCore.getMessageManager().clearMessages(...)` (see [pcore-messaging-details.md](../references/pcore-messaging-details.md)).

## Deleting a case throws, or deletes the wrong thing

**Cause:** `ActionsApi.deleteWork` and `ActionsApi.deleteCaseInCreateStage` are not interchangeable — one is for a case that has already left its create stage (persisted, has a confirmed ID), the other is for a case still being created.

**Fix:** branch on the case's stage before choosing which method to call — see [safe-case-deletion](../pconnect-assignment-lifecycle/cookbooks/safe-case-deletion.md).

## Subscription callback keeps firing after the component unmounts

**Cause:** the unsubscribe/cancel function returned by `subscribe` (data page, `PubSubUtils`, or `MessagingServiceManager`) was never called. This can also surface as a React warning about updating state on an unmounted component.

**Fix:** always store and invoke the returned unsubscribe handle in a cleanup function (e.g. a `useEffect` cleanup) — see [data-page-subscription-cleanup](../pconnect-data-subscriptions/cookbooks/data-page-subscription-cleanup.md), [pubsub-cleanup](../pconnect-data-subscriptions/cookbooks/pubsub-cleanup.md), and [realtime-case-subscription](../pconnect-data-subscriptions/cookbooks/realtime-case-subscription.md).

## Locale switched, but already-rendered labels didn't update

**Cause:** `PCore.switchLocale(locale)` changes the active locale going forward — it does not retroactively re-resolve strings that a component already fetched and stored (e.g. in state) before the switch.

**Fix:** re-call `pConn.getLocalizationService().getLocalizedText(...)`/`getLocalizedMessage(...)` after the locale switch resolves, for any string held in component state — see [locale-switch-and-relocalize](../pconnect-navigation-locale-genai/cookbooks/locale-switch-and-relocalize.md).

## Two users' (or two components') personalization saves overwrite each other

**Cause:** `PersonalizationUtils` saves are keyed by `listComponentID` — if two different components/instances reuse the same ID, their saves collide, last write wins.

**Fix:** make `listComponentID` unique and stable per component instance (max 32 chars) — see [view-personalization](../pconnect-lists-and-views/cookbooks/view-personalization.md).

## A cascading dependent field doesn't refresh after the field it depends on changes

**Cause:** the dependent field's cascade subscription wasn't set up before the source field's change was dispatched, or the subscription's cleanup fired too early.

**Fix:** follow the subscribe-before-trigger ordering in [cascading-dependent-fields](../pconnect-forms-and-fields/cookbooks/cascading-dependent-fields.md).

## `ContainerUtils.closeContainerItem` doesn't behave like `ContainerManager.removeContainerItem`

**Cause:** these two methods are not interchangeable. `closeContainerItem` performs a dirty-state check before closing (part of `ContainerUtils`); `removeContainerItem` (part of `ContainerManager`) removes an item from the container's item list without that check.

**Fix:** use the one that matches your intent — see [container-item-lifecycle](../pconnect-lists-and-views/cookbooks/container-item-lifecycle.md).

## A data page still shows old data right after a save

**Cause:** data page results are cached; saving a record through a different call doesn't automatically invalidate a data page instance that already cached the old result.

**Fix:** call `DataPageUtils.markDataInstanceDirty(dataPageName, parameters)` after the save, or re-fetch with the `{ invalidateCache: true }` option, before reading the data page again — see [pcore-rest-data-details.md](../references/pcore-rest-data-details.md). See also [Performance & Efficiency: cache deliberately](./performance-and-efficiency.md#cache-data-pages-but-invalidate-deliberately).

## A typeahead/search field hammers the server on every keystroke

**Cause:** the field's `fetchData`/REST call is wired directly to the input's `onChange`, with no debouncing or buffering.

**Fix:** debounce with `AsynchronousUtils.getDebouncedSubject(delay)` or configure `DataApi.registerForBufferedCall({ waitTime, maxSize })` before fetching — see [Performance & Efficiency: debounce and buffer](./performance-and-efficiency.md#debounce-or-buffer-user-triggered-calls).

## The UI shows "online" right after the network actually dropped (or vice versa)

**Cause:** the component reads `navigator.onLine` directly or adds its own `window` `online`/`offline` listeners instead of using the platform's own connectivity tracking, and misses an edge case the platform already handles.

**Fix:** use `PCore.getNetworkUtils().isOnline()`/`onStatusChange(callback)` instead — see [pcore-environment-locale-namespace.md](../references/pcore-environment-locale-namespace.md).

## An older async response overwrites a newer one (a fast-typed search shows results for an earlier query)

**Cause:** two overlapping requests were in flight (e.g. triggered by two keystrokes) and the one that started first happened to resolve last, and nothing discarded the stale response.

**Fix:** cancel the superseded request with `RestClient.getCancelTokenSource()`/check `isRequestCanceled(error)` before treating a rejection as a real error, or otherwise tag each request and ignore a resolution that isn't for the latest one — see [pcore-rest-data-details.md](../references/pcore-rest-data-details.md) and [Error Handling & Resiliency: distinguish cancellation from failure](./error-handling-and-resiliency.md#distinguish-cancellation-from-failure).

## The same generic error message shows for every failure, which makes triage hard

**Cause:** `ErrorHandler`'s generic failure message (shown when a component fails to render) hasn't been customized, so every unrelated failure looks identical to the user/tester.

**Fix:** call `PCore.getErrorHandler().setGenericFailedMessage(message)` with a clearer default, and prefer surfacing a specific, component-level error state over relying solely on the generic fallback — see [pcore-misc-details.md](../references/pcore-misc-details.md).

## A field's validation error message won't clear even after the value is fixed

**Cause:** `ValidationApi.validate(value, propertyName?)` (see [pconnect-validation-api.md](../references/pconnect-validation-api.md)) both validates and writes the result to application state — if the corrected value is never re-passed through `validate()` (for example, a fix applied programmatically rather than through the field's own change handler), the stale message stays in state because nothing told it to re-evaluate.

**Fix:** re-run `validate()` with the corrected value through the same path a normal user edit would take, rather than only updating the underlying value and assuming the displayed message updates itself.

## An attachment upload appears stuck and never resolves

**Cause:** `AttachmentUtils.uploadAttachment` (see [pcore-case-collaboration-details.md](../references/pcore-case-collaboration-details.md)) rejected or the resolved promise's status was never checked, and nothing surfaces a stuck/failed state to the user — the UI is left showing a permanent "uploading" indicator instead of an error.

**Fix:** always attach a `.catch`/handle the rejection path for `uploadAttachment` (see [Error Handling & Resiliency: never fail silently](./error-handling-and-resiliency.md#never-fail-silently)), and pair it with a reasonable timeout guard (see [Error Handling & Resiliency: guard against a call that never resolves](./error-handling-and-resiliency.md#guard-against-a-call-that-never-resolves)) so a genuinely hung request doesn't leave the indicator spinning forever.

## A GenAI Assistant conversation's history is empty after a page reload

**Cause:** `GenAIAssistantUtils.createConversation`/`sendMessage` (see [pcore-analytics-genai-details.md](../references/pcore-analytics-genai-details.md)) manage the conversation server-side, but the component only reads messages from its own local state (populated as the user sends/receives messages in that session) rather than re-fetching the conversation on mount.

**Fix:** on mount, call `getMessages(assistantID, conversationID, context)`/`getConversations(...)` to rehydrate history from the server instead of assuming local state is the source of truth — local state should be treated as a cache of what `getMessages` would return, not the only copy.

## The autosave indicator stays "unsaved" after a successful save

**Cause:** a change was made through a path that doesn't call `AutosaveUtils.notifyChange(context, propReference, value)` (see [pcore-misc-details.md](../references/pcore-misc-details.md)) — for example, a value set directly via a lower-level state update instead of the field's normal change handler — so the autosave engine never learns the edit happened, and its status subscription never transitions out of the stale state.

**Fix:** route every user-facing edit path through the same mechanism a normal field edit uses, so `notifyChange` fires consistently; don't bypass it for "programmatic" updates that are still meant to be autosaved.

## A buffered/typeahead call never fires, even though the user kept typing

**Cause:** `DataApi.registerForBufferedCall({ waitTime, maxSize })` (see [pcore-rest-data-details.md](../references/pcore-rest-data-details.md)) batches calls until either `waitTime` elapses with no new input or `maxSize` queued calls are reached — if `waitTime` is set too high relative to how the component's lifecycle unmounts/resets between keystrokes (for example, the component re-creates the `DataApi` instance on every render instead of reusing one), the buffer can be discarded before it ever fires.

**Fix:** create the buffered `DataApi` instance once (not on every render) and confirm `waitTime` is tuned to the input's actual typing cadence — see [Performance & Efficiency: debounce or buffer user-triggered calls](./performance-and-efficiency.md#debounce-or-buffer-user-triggered-calls).

## Still stuck?

If the symptom isn't listed above, first re-check the exact signature in the relevant `references/` file — many "the method doesn't work" reports turn out to be a missed required parameter, not a bug. If the method genuinely isn't documented anywhere in these skills, treat it as unsupported rather than assuming it exists at runtime.
