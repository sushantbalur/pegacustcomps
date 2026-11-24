---
title: Error Handling & Resiliency
description: How to choose a deliberate recover/retry/degrade/block strategy for PCore/PConnect failures, avoid silent failures, and contain them so one broken call doesn't take down a whole view.
---

# Error Handling & Resiliency

> Part of [Cross-Cutting Best Practices](./README.md).

Nearly every method in these skills that crosses the network returns a `Promise` that can reject. This guide covers how to handle that rejection deliberately, rather than leaving it to whatever the default behavior happens to be.

## Choose a Deliberate Strategy: Recover, Retry, Degrade, or Block

Every call that can fail should have an intentional answer to "what happens when this rejects" — picked at the time you write the call, not left to be discovered later. Four broad strategies, roughly in order of how disruptive they are to the user:

| Strategy    | When to use it                                                                                        | Example                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Recover** | The failure has an obvious, safe fallback value.                                                      | An optional lookup data page fails — render the field without the enrichment instead of blocking.  |
| **Retry**   | The failure is likely transient (network blip) and the operation is safe to repeat.                   | A read-only data page fetch fails once — retry it, not a non-idempotent submit (see below).        |
| **Degrade** | Part of the view can still be useful without the failed piece.                                        | A GenAI Assistant suggestion fails to load — show the rest of the form, omit the suggestion panel. |
| **Block**   | The failure means continuing would be incorrect or unsafe (e.g. an assignment submit or case delete). | `ActionsApi.finishAssignment` fails — stop, surface the error, do not proceed as if it succeeded.  |

Pick the strategy deliberately for each call; don't let every failure default to the same generic error message regardless of how disruptive the underlying failure actually is.

## Never Fail Silently

An empty `catch` block, or a rejected promise nobody attaches a handler to, hides the failure from both the user and anyone debugging it later. Every failure path needs an observable outcome: a visible error state in the UI, a call to `ErrorHandler`, or at minimum a re-thrown/logged error — never a silent no-op.

```typescript
// Avoid: the user has no idea the save failed, and nothing is logged.
saveChanges().catch(() => {});

// Prefer: the failure is visible, and the strategy (recover/retry/degrade/block) is explicit.
try {
  await saveChanges();
} catch (error) {
  setErrorState('Your changes could not be saved. Please try again.');
}
```

## Idempotency Before Retrying a Submit

Retrying is only safe when repeating the call can't cause a duplicate effect. A read (`getPageDataAsync`, `getData`) is generally safe to retry. A write that isn't idempotent — `ActionsApi.finishAssignment`, `deleteWork`, `AttachmentUtils.uploadAttachment` — is not automatically safe to retry blindly: if the first attempt actually succeeded server-side and only the client-side confirmation was lost (e.g. a network drop after the request was sent), a naive retry can duplicate the submit or the upload. See [graceful-submit-failure](../pconnect-assignment-lifecycle/cookbooks/graceful-submit-failure.md) for the documented pattern — confirm the actual outcome (e.g. re-check case/assignment state) before assuming a retry is safe, rather than resubmitting on every failure by default.

## Distinguish Cancellation From Failure

A request canceled on purpose (because a newer one superseded it, or the component unmounted) is not an error and shouldn't be shown as one. Check `RestClient.isRequestCanceled(error)` (see [pcore-rest-data-details.md](../references/pcore-rest-data-details.md)) before running your failure-handling path:

```typescript
invokeRestApi(routeKey, payload).catch((error) => {
  if (PCore.getRestClient().isRequestCanceled(error)) return; // intentional — not a failure
  showErrorState(error);
});
```

## Degrade Gracefully When Offline

`NetworkUtils.isOnline()`/`onStatusChange(callback)` (see [pcore-environment-locale-namespace.md](../references/pcore-environment-locale-namespace.md)) let a component know about connectivity changes rather than discovering them only via a failed request. When offline, prefer disabling/queuing calls that require the network (submits, uploads) with a clear "you're offline" state, over letting each one fail individually and showing a wall of unrelated error messages for what is really one underlying cause.

## Contain Failures With Boundaries

A single custom component throwing during render shouldn't be able to blank out an entire page around it. Wrap custom widget rendering in a React error boundary so a failure in one component degrades to an error state for that component's region, not the whole view — this is standard React practice and applies directly here since a rejected `Promise` mishandled inside a component (e.g. an unhandled rejection that triggers a render-time throw) is a common way for one bad API call to take down an unrelated part of the page.

## Give Users an Actionable Message, Not a Stack Trace

`ErrorHandler.setGenericFailedMessage(message)`/`getGenericFailedMessage()` (see [pcore-misc-details.md](../references/pcore-misc-details.md)) control the fallback message shown when a component fails to render. Set this to something a user can act on ("Something went wrong loading this section. Try refreshing the page.") rather than leaving a default that isn't meaningful to an end user — and prefer a specific, component-level error message over the generic fallback whenever the component knows what actually failed. Never surface the raw rejection value, an internal error code, or a stack trace to the user (see [Security Considerations](./security-considerations.md#dont-leak-sensitive-details-through-error-handling)).

## Distinguish a Validation Rejection From a System Failure

`ValidationApi.validate(value, propertyName?)`/`validateEmail(value, options?)` (see [pconnect-validation-api.md](../references/pconnect-validation-api.md)) return a result object describing _why the input was invalid_ — this is not the same category of failure as a rejected `Promise` from a network call, and the two need different handling. A validation result belongs inline, next to the field, worded around what the user should fix; a system/network failure belongs in a broader error state and is worded around what went wrong with the operation, not the input. Don't route both through the same generic error-message path — collapsing them makes a simple "enter a valid email" correction look as alarming as a failed save, and makes a real system failure easy to dismiss as "just a typo."

## Retry With a Backoff and a Limit, Never Forever

When a retry strategy is appropriate (see the table above), retrying immediately and indefinitely can turn a transient blip into a self-inflicted flood of requests against a server that's already struggling. Space retries out (for example, doubling the delay each attempt) and cap the number of attempts, surfacing the failure state once the cap is reached instead of retrying silently forever:

```typescript
async function fetchWithRetry(fn: () => Promise<unknown>, attempts = 3, delayMs = 500): Promise<unknown> {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return fetchWithRetry(fn, attempts - 1, delayMs * 2);
  }
}
```

## Handle a Case Locked or Changed by Another User as an Expected Outcome

A submit, save, or field update can fail specifically because another user (or another tab/session for the same user) modified or locked the same case/assignment first — this is a distinct, expected failure mode in a collaborative system, not the same as a generic network error. Recognize it from the specific failure the call surfaces and give the user a clear next step ("This case was updated by someone else — refresh to see the latest version before continuing") rather than the generic failed-save message, and don't silently overwrite the other change by blindly retrying the original submit.

## Guard Against a Call That Never Resolves

A `Promise` that neither resolves nor rejects (a hung request, a subscription callback that never fires) leaves a loading state on screen indefinitely with no path to an error state. For a call where the framework doesn't already provide a timeout, wrap it with your own bound so the UI can fall back to a visible error/timeout state instead of spinning forever:

```typescript
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([promise, new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timed out')), ms))]);
}
```

Prefer this only as a defensive fallback around calls with no first-class cancellation, not as a substitute for `RestClient.getCancelTokenSource()` (see [Performance & Efficiency: cancel requests that are no longer needed](./performance-and-efficiency.md#cancel-requests-that-are-no-longer-needed)) where that's available — an explicit cancel also stops the server from doing wasted work, where a client-side timeout alone does not.

## Checklist

- Decide recover/retry/degrade/block for each call at the time you write it, not by default.
- Never leave a rejected promise unhandled or a `catch` block empty — every failure needs an observable outcome.
- Only retry idempotent operations automatically; confirm actual outcome before retrying a non-idempotent submit/upload/delete.
- Check `isRequestCanceled` before treating a canceled request as a failure.
- Use `NetworkUtils` to detect offline state proactively rather than reacting to a pile of individually failed requests.
- Wrap custom component rendering in an error boundary so one failure doesn't blank the whole page.
- Show a clear, actionable, generic message to the user; never a raw error object or stack trace.
- Route validation results and system failures through different UI treatments — don't make a field-level typo look like a broken save.
- Space out and cap any automatic retry loop; never retry immediately and indefinitely.
- Give a case-locked/changed-by-another-user failure its own clear message and next step, instead of the generic failed-save path.
- Guard a call with no built-in cancellation/timeout so a hung request can't leave a loading state on screen forever.
