---
title: Testing Components That Use PCore/PConnect
description: How to mock PCore and PConnect in Jest + React Testing Library tests, covering type safety, the four API-driven UI states, cancellation, debouncing, and cleanup — without over-mocking or coupling tests to internal implementation.
---

# Testing Components That Use PCore/PConnect

> Part of [Cross-Cutting Best Practices](./README.md).

A component that calls `PCore.*` or `pConn.*` needs those calls mocked in a unit test — `PCore` and `PConnect` are runtime globals provided by the Constellation shell, never available in a plain Jest environment. This guide covers how to mock them correctly, and how to test the behaviors that are specific to API-driven components (loading/error states, cancellation, debouncing, cleanup).

## Only Mock What the Component Actually Uses

Do not create a large, all-purpose mock of `PCore` or `pConn` shared across every test. Mock only the methods the component under test actually calls, scoped to that test file:

```typescript
beforeEach(() => {
  globalThis.PCore = {
    getEnvironmentInfo: () => ({ getLocale: () => 'en-US' }),
    getAttachmentUtils: () => ({ uploadAttachment: jest.fn() })
    // Add more only as the component grows to call more of PCore.
  } as unknown as typeof PCore;
});
```

**NEVER** add `PCore`/`pConn` mocks to a shared `setupTests.ts` or `setupGlobals.ts` file. A shared global mock hides which methods a given component actually depends on, and one test's mock shape silently leaks into unrelated tests. Each test file owns its own mock.

## Mocking `pConn` (PConnect)

`pConn` is normally obtained via a `getPConnect` prop. Mock the prop function to return an object literal with only the methods the component calls:

```typescript
const mockPConnect = {
  getValue: jest.fn().mockReturnValue(''),
  getActionsApi: jest.fn().mockReturnValue({
    updateFieldValue: jest.fn()
  })
};

render(<MyComponent getPConnect={() => mockPConnect} />);
```

For a method the component calls conditionally (`pConn.someMethod?.()`), still provide it in the mock when the test exercises that branch — an optional-chained call that resolves to `undefined` will silently skip the branch instead of failing, which can mask a broken test.

## Keep Mocks Type-Safe, Not `any`

A mock typed as `any` compiles no matter how far it drifts from the real API — it will happily accept a call with the wrong argument count or a typo'd method name. Cast the mock object to the real type instead of typing it as `any`, so a genuine signature mismatch is caught at compile time rather than discovered at runtime:

```typescript
const mockPConnect: Partial<PConnect> = {
  getValue: jest.fn().mockReturnValue('')
};

render(<MyComponent getPConnect={() => mockPConnect as PConnect} />);
```

This is also why a full, shared, all-purpose mock is a trap even when it's convenient: a giant object that "implements everything" tends to get typed as `any`/`unknown` to avoid maintenance overhead, which silently defeats this safety net. Small, per-test, precisely typed mocks keep the type checker useful.

## Test the Four States of an API-Driven Component

Any component whose rendered output depends on a `Promise`-returning `PCore`/`pConn` call has (at least) four distinct states worth a test each — it's easy to only cover the success path and ship the other three unverified:

| State   | What to assert                                                                                           |
| ------- | -------------------------------------------------------------------------------------------------------- |
| Loading | A loading indicator/skeleton is shown while the promise is still pending.                                |
| Success | The resolved data renders correctly, and the loading indicator is gone.                                  |
| Empty   | A resolved-but-empty result (e.g. `[]` or `null`) renders an empty state, not a blank screen or a crash. |
| Error   | A rejected promise renders a visible error state — never a silently blank component.                     |

```typescript
it('renders an empty state when the data page returns no rows', async () => {
  const getListDataView = jest.fn().mockResolvedValue({ data: [] });
  globalThis.PCore = { getDataApiUtils: () => ({ getListDataView }) } as unknown as typeof PCore;

  render(<MyListComponent getPConnect={() => mockPConnect} />);

  expect(await screen.findByText(/no results/i)).toBeInTheDocument();
});
```

## Testing Promise-Returning Methods

Most PCore/PConnect methods that hit the network return a `Promise`. Mock both the success and rejection path, and assert on the resulting UI state rather than on the mock call itself:

```typescript
it('shows an error state when the upload fails', async () => {
  const uploadAttachment = jest.fn().mockRejectedValue(new Error('upload failed'));
  globalThis.PCore = { getAttachmentUtils: () => ({ uploadAttachment }) } as unknown as typeof PCore;

  render(<AttachmentUploader />);
  await userEvent.upload(screen.getByLabelText(/choose file/i), someFile);

  expect(await screen.findByRole('alert')).toHaveTextContent(/upload failed/i);
});
```

## Testing Cancellation-Aware Requests

If a component uses `RestClient.getCancelTokenSource()`/`isRequestCanceled()` (see [pcore-rest-data-details.md](../references/pcore-rest-data-details.md)) to abort an in-flight request — for example, when a search term changes before the previous search resolved — test that a canceled request's resolution is ignored rather than shown as an error:

```typescript
it('ignores a canceled request instead of showing an error', async () => {
  const cancel = jest.fn();
  const invokeRestApi = jest.fn().mockRejectedValue(new Error('canceled'));
  globalThis.PCore = {
    getRestClient: () => ({
      getCancelTokenSource: () => ({ token: {}, cancel }),
      invokeRestApi,
      isRequestCanceled: () => true
    })
  } as unknown as typeof PCore;

  const { rerender } = render(<SearchField getPConnect={() => mockPConnect} query="a" />);
  rerender(<SearchField getPConnect={() => mockPConnect} query="ab" />);

  expect(cancel).toHaveBeenCalled();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
```

## Testing Debounced or Buffered Input

If a component uses `AsynchronousUtils.getDebouncedSubject(delay)` or `DataApi.registerForBufferedCall({ waitTime })` (see [pcore-misc-details.md](../references/pcore-misc-details.md) and [pcore-rest-data-details.md](../references/pcore-rest-data-details.md)) to avoid firing a request on every keystroke, use fake timers to assert the call is debounced rather than fired once per keystroke:

```typescript
it('fires one lookup after typing stops, not one per keystroke', async () => {
  jest.useFakeTimers();
  const fetchData = jest.fn().mockResolvedValue([]);
  // ...render, then simulate rapid input...
  jest.advanceTimersByTime(300);

  expect(fetchData).toHaveBeenCalledTimes(1);
  jest.useRealTimers();
});
```

## Testing Subscribe/Unsubscribe Cleanup

Any component that subscribes to a data page, `PubSubUtils`, or `MessagingServiceManager` should have its unmount behavior tested — a missed unsubscribe is a real bug (see [Troubleshooting: subscription keeps firing after unmount](./troubleshooting-common-pitfalls.md#subscription-callback-keeps-firing-after-the-component-unmounts)), and it is straightforward to verify:

```typescript
it('unsubscribes on unmount', () => {
  const subscribe = jest.fn().mockReturnValue('sub-1'); // MessagingServiceManager.subscribe returns the subscription id
  const unsubscribe = jest.fn();
  globalThis.PCore = { getMessagingServiceManager: () => ({ subscribe, unsubscribe }) } as unknown as typeof PCore;

  const { unmount } = render(<MyComponent getPConnect={() => mockPConnect} />);
  unmount();

  expect(unsubscribe).toHaveBeenCalledWith('sub-1');
});
```

`PubSubUtils.subscribe` returns nothing: it unsubscribes by event type and subscriber name, so assert `unsubscribe` was called with `(eventType, name)` instead.

## Avoid Testing Implementation Details

Assert on what the user would see or experience (rendered text, roles, an emitted callback prop), not on private internals. A test that asserts "component calls `getValue` exactly once" is brittle — it breaks on a harmless refactor (e.g. reading the value once and memoizing it vs. reading it twice) without the actual behavior changing. The one legitimate exception is cleanup/lifecycle behavior (unsubscribe, cancel) where the call itself **is** the behavior under test — there, asserting the mock was called is correct, not an implementation-detail test.

## Guard Against Mock/Reality Drift

A mock that always resolves happily gives false confidence once the real method's signature or behavior changes upstream. Periodically re-check a component's mocks against the method's actual documented signature in `references/` — an outdated mock (missing a newly required parameter, or resolving a shape the real method no longer returns) can keep a test green long after the component itself is broken against the real API.

## Prefer `findBy`/`waitFor` Over Manual Timers for Async Assertions

Once a mock resolves a `Promise`, the resulting state update is asynchronous — asserting on it immediately (before the microtask queue flushes) is a common source of flaky tests. Use RTL's `findBy*` queries (which internally retry until timeout) or `waitFor` instead of an arbitrary `setTimeout`/manual `await Promise.resolve()` chain:

```typescript
// Avoid: a magic delay that's either too short (flaky) or too long (slow suite).
await new Promise((resolve) => setTimeout(resolve, 100));
expect(screen.getByText(/loaded/i)).toBeInTheDocument();

// Prefer: retries automatically until the assertion passes or times out.
expect(await screen.findByText(/loaded/i)).toBeInTheDocument();
```

The one exception is a debounced/buffered call under fake timers (see above) — there, `jest.advanceTimersByTime` is the correct, deterministic way to advance past the delay, not a substitute for `findBy`/`waitFor` on the resulting UI update.

## Testing Locale-Dependent Rendering

If a component reads `pConn.getLocalizationService().getLocalizedText(...)`/`getLocalizedMessage(...)` (see [pcore-environment-info-details.md](../references/pcore-environment-info-details.md)) or calls `PCore.switchLocale(locale)`, mock the localization service to return a distinguishable value per key rather than echoing the key back unchanged — an identity mock (`getLocalizedText: (key) => key`) can hide a bug where the component accidentally renders the raw key instead of the resolved value in production:

```typescript
const mockPConnect = {
  getLocalizationService: () => ({
    getLocalizedText: (key: string) => `[localized]${key}`
  })
};
```

If the component also needs to react to a locale switch (see [Troubleshooting: locale switched but labels didn't update](./troubleshooting-common-pitfalls.md#locale-switched-but-already-rendered-labels-didnt-update)), add a test that re-invokes the localization mock after simulating the switch and asserts the rendered text actually changed — not just that the switch function was called.

## Testing GenAI Assistant Conversations

`GenAIAssistantUtils.sendMessage`/`sendMessageForAgent` (see [pcore-analytics-genai-details.md](../references/pcore-analytics-genai-details.md)) resolve a `Promise`, and `GenAIUtils.rewriteText` resolves a discriminated union (`{ success: true, rewrittenText }` or `{ success: false, ... }`). Test both branches of the union explicitly — a mock that only ever resolves the success shape hides a missing/incorrect handler for the failure shape:

```typescript
it('shows a fallback message when text rewriting reports failure', async () => {
  const rewriteText = jest.fn().mockResolvedValue({ success: false, message: 'unavailable' });
  globalThis.PCore = {
    getEnvironmentInfo: () => ({ isGenAIEnabled: () => true }),
    getGenAIUtils: () => ({ rewriteText })
  } as unknown as typeof PCore;

  render(<RewriteButton getPConnect={() => mockPConnect} />);
  await userEvent.click(screen.getByRole('button', { name: /rewrite/i }));

  expect(await screen.findByText(/unavailable/i)).toBeInTheDocument();
});
```

Also test the gate itself: when `isEnvironmentInfo().isGenAIEnabled()` returns `false`, assert the component doesn't render the GenAI-dependent affordance at all, rather than rendering it and letting the call fail.

## Build Small, Local Test Data Factories Instead of One Shared Fixture

A single large shared fixture object (for example, one exported `mockCaseData` used across many test files) tends to accumulate fields for whichever test needed them first, and every later test either depends on unrelated fields it doesn't understand or has to override several to get a clean state. Prefer a small factory function local to (or near) the test file that returns a minimal valid object, with overrides for the specific field a test cares about:

```typescript
const buildCaseInfo = (overrides: Partial<CaseInfo> = {}): CaseInfo => ({
  ID: 'WORK-1',
  caseTypeName: 'Case',
  status: 'Open',
  ...overrides
});

it('shows a resolved badge when the case is closed', () => {
  render(<CaseStatusBadge caseInfo={buildCaseInfo({ status: 'Resolved' })} />);
  expect(screen.getByText(/resolved/i)).toBeInTheDocument();
});
```

## Checklist

- Mock only the methods the component under test calls — no shared, all-purpose global mock.
- Type mocks against the real interface (`Partial<PConnect>`/`typeof PCore`) instead of `any`, so drift is caught at compile time.
- Cover all four states for any API-driven view: loading, success, empty, and error.
- If the component cancels stale requests, test that a canceled/superseded response doesn't produce a visible error.
- If the component debounces/buffers input, use fake timers to assert a single call, not one per keystroke.
- If the component subscribes to anything, add a test asserting the unsubscribe function is called on unmount.
- Assert on rendered output (`screen.getByRole`/`getByText`) rather than on internal state or an incidental mock call.
- Never make a real network call from a unit test — every `PCore`/`pConn` method the component touches must be mocked.
- Use `findBy*`/`waitFor` for async assertions instead of arbitrary `setTimeout` delays.
- Mock localization with a distinguishable value per key, not an identity echo, so a raw-key rendering bug can't hide.
- For a GenAI-gated affordance, test both the enabled/disabled gate and the success/failure branches of any discriminated-union result.
- Prefer small, local test-data factory functions over one large shared fixture that accumulates unrelated fields.
