---
title: Accessibility for Async, API-Driven Components
description: How to announce loading/success/error states, manage focus after navigation, and localize status text for components driven by PCore/PConnect calls, aligned with WCAG 2.2 AA.
---

# Accessibility for Async, API-Driven Components

> Part of [Cross-Cutting Best Practices](./README.md).

Every state transition covered elsewhere in these guides — a pending `Promise`, a resolved success/empty/error result, a navigation to a new view — is also a moment a screen reader or keyboard-only user can silently miss if it isn't announced or focused correctly. This guide covers where WCAG 2.2 AA requirements intersect with PCore/PConnect usage specifically; it isn't a general accessibility reference.

## Announce Async State Changes With a Live Region, Not Just a Visual Change

The four states covered in [Testing: the four states of an API-driven component](./testing-pconnect-components.md#test-the-four-states-of-an-api-driven-component) (loading, success, empty, error) are all status messages under WCAG 4.1.3 Status Messages. A spinner that only changes visually, or an error message that only appears in the DOM without the right role, is invisible to a screen reader user unless focus already happens to be there:

```tsx
return (
  <>
    {isLoading && <span role='status'>Loading case details…</span>}
    {error && <span role='alert'>{userFacingErrorMessage}</span>}
  </>
);
```

Use `role="status"` (equivalent to `aria-live="polite"`) for routine completions and `role="alert"` (equivalent to `aria-live="assertive"`) only for genuinely urgent failures — reserve `alert` the same way the [Error Handling & Resiliency](./error-handling-and-resiliency.md#choose-a-deliberate-strategy-recover-retry-degrade-or-block) guide reserves the "block" strategy, for failures that actually need immediate attention. The live region container should already exist in the DOM before the async call resolves; don't inject the container and its message at the same time — a live region added to the DOM at the same moment as its content is often not announced.

## Localize Status Text, Don't Just Make It Announceable

A correctly-roled status message that's hardcoded in one language is still an accessibility (and localization) gap for users on a different locale. Pull status/error copy through `pConn.getLocalizationService().getLocalizedText(...)`/`getLocalizedMessage(...)` (see [pconnect-case-info-data-info-localization.md](../references/pconnect-case-info-data-info-localization.md)) the same way any other user-facing string in these components must be — never hardcode display text. This applies doubly to async status text, since it's easy to hardcode a "quick" loading/error string and forget it needs the same localization treatment as the rest of the view.

## Move Focus After a Navigation-Driven View Change

When a component navigates to a new view or case — via `SemanticUrlUtils.getResolvedSemanticURL`/a container item open, or after `PCore.switchLocale` re-renders localized content — the resulting DOM change is a route change under WCAG 2.4.3 Focus Order: focus must be set to an appropriate element (typically the new view's heading, or a confirmation message for an in-place save) after the update, rather than being left on a now-stale or removed trigger element:

```typescript
const headingRef = useRef<HTMLHeadingElement>(null);

useEffect(() => {
  if (viewHasLoaded) headingRef.current?.focus();
}, [viewHasLoaded]);
```

## Don't Let a Loading Overlay Trap or Skip Keyboard Focus

A full-panel loading overlay shown while a `Promise` is pending should either disable focus on the content underneath it (so Tab doesn't silently move focus to now-hidden controls) or, if it's a true modal overlay, provide a documented keyboard exit (for example, Escape) as required by WCAG 2.1.2 No Keyboard Trap for any intentional focus trap. An overlay that visually covers content but leaves the covered controls still tab-reachable is a common, easy-to-miss defect specific to async loading states.

## Checklist

- Every loading/success/empty/error transition has a corresponding `role="status"`/`role="alert"` live region, not just a visual change.
- Live region containers exist in the DOM before the async result that populates them arrives.
- Status and error text is localized through `LocalizationService`, not hardcoded.
- Focus moves to the new view's heading (or a confirmation message) after a navigation or in-place content swap, rather than staying on a stale trigger.
- A loading overlay either disables the controls it covers or provides a documented keyboard exit if it's an intentional modal trap.
