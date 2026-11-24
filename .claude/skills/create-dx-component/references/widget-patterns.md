# Widget Patterns

How production Constellation widgets fetch data, stay correct as props change, clean up, mutate and confirm. The states themselves are in [state-matrix.md](./state-matrix.md); the basic fetch recipe is the [data widget cookbook](../cookbooks/build-a-data-widget.md). This file covers what those leave out.

Use only PCore/PConnect methods documented in the [API catalog](./pcore-pconnect-apis.md). Where this file mentions something the catalog does not document, it says so; treat it as unsupported unless the user confirms otherwise. Cosmos component props below come from a newer Cosmos than customers may have installed, so check the `.d.ts` in `node_modules/@pega/cosmos-react-core` first.

## Platform facts

- The platform wraps every component, including a custom widget, in an error boundary. A widget that throws shows the platform's generic failure message instead of blanking the page. Add a local boundary only to degrade one section of a widget while the rest keeps working.
- Every component receives a `locale` prop and re-renders when the locale changes. Use it as an effect dependency to re-localize cached labels instead of storing translated strings.
- A component re-renders only when a declared state prop, `locale` or its inherited props change. A value read with `pConn.getValue()` that is not a state prop will not trigger a re-render by itself; refetch on an event, or declare the value in `config.json`.

## Fetch lifecycle

Model the widget as one status value, not independent booleans:

```typescript
type Status = 'loading' | 'error' | 'empty' | 'success';
const [status, setStatus] = useState<Status>('loading');
```

The reference shape (the best lifecycle in Pega's own widgets):

```typescript
// Depend on an object prop by a stable key, and read the live object from a ref.
const parametersKey = JSON.stringify(parameters ?? {});
const parametersRef = useRef(parameters);
parametersRef.current = parameters;

useEffect(() => {
  if (!dataPage) {
    setStatus('empty'); // not configured: a different empty from "no results"
    return undefined;
  }
  let isMounted = true;
  setStatus('loading');
  PCore.getDataApiUtils()
    .getData(dataPage, { dataViewParameters: parametersRef.current }, context)
    .then((response) => {
      if (!isMounted) return;
      const rows = response.data?.data ?? [];
      setRows(rows);
      setStatus(rows.length ? 'success' : 'empty');
    })
    .catch(() => {
      if (isMounted) setStatus('error'); // failure is not "empty"
    });
  return () => {
    isMounted = false; // ignore late responses after unmount or a dependency change
  };
}, [dataPage, parametersKey, context]);
```

Rules:

- **Guard every async result** with the `isMounted` flag (or an `AbortController`). A flag that is set in `useState` inside the async callback is dead: the closure always sees `true`. Use a local variable in the effect, or `useRef`.
- **Reset `loading` in `.finally`, or in both `.then` and `.catch`.** Resetting only in `.then` leaves a permanent skeleton after a failed first fetch (several of Pega's own list widgets do this).
- **Do not swallow failures into `[]`.** That makes a failed request look like "no results". Keep `'error'` distinct from `'empty'`.
- **Depend on object props with a stable key** (`JSON.stringify(obj)`), not the object itself, or the effect reruns every render. For an array, use a sorted, de-duplicated, joined string.
- **Do not blank content on refresh.** Keep the previous rows visible and show a busy indicator on the control; show `count` as undefined while loading, never `0`.
- **Work lists must bypass the cache after a save.** Pass `invalidateCache: true` in the options of `getDataAsync` / `getPageDataAsync` where the catalog documents it, or the widget shows the cached copy.
- **Cancel or ignore superseded requests.** For search-as-you-type, create a new `AbortController` per request and abort the previous one first; ignore the cancellation error and do not reset `loading` in that case, because the newer request owns the spinner. Cancellation is not an error. Detect it with `PCore.getNetworkUtils()`-style `isRequestCanceled` where the catalog documents it. Check that the installed `getData` accepts a signal before passing one; the catalog types its options as `unknown`.
- **A secondary request (a record count, an optional section) must not fail the widget.** Catch it, keep the list, and leave the count unset.
- **Map responses to a view model in one pure function**: guard `Array.isArray(x) ? x : []`, tolerate missing optional fields and treat a `null` list as empty. Keep that mapper separate from rendering so tests feed it fixtures.

### Summary then expand

Fetch a short page first (for example 3 rows with a total count) and fetch everything only when the user expands. A failure of the second call just clears its pending flag; the summary stays.

## Duplicate activation and requests

- Block a second click on an async action with a **ref flag** (synchronous), reset in `.finally` so a failure also unlocks it:

  ```typescript
  const opening = useRef(false);
  const onOpen = () => {
    if (opening.current) return;
    opening.current = true;
    pConn.getActionsApi().openAssignment(id, className, { containerName })
      .finally(() => { opening.current = false; });
  };
  ```

- Use a ref flag for "load more" and "prefetch next page" the same way. Use state for what the UI shows (disabled, busy) and the ref for the guard.
- A confirm dialog must not stack: ignore a second request while one is open.

## Subscriptions

Documented in [pcore-messaging-details.md](../../references/pcore-messaging-details.md) and the [data subscriptions skill](../../pconnect-data-subscriptions/SKILL.md). The checklist:

1. Give each instance a unique subscriber name (`createUID()` from Cosmos, or `crypto.randomUUID()` in a `useRef`). A fixed name means two instances in one context overwrite each other.
2. Unsubscribe in the effect cleanup with the same name **and the same `contextName`**.
3. Key the effect on the identifiers it uses (for example `[caseID]`), so it resubscribes when they change and not on every render. An effect with no dependency array that subscribes inside a timer resubscribes every render.
4. Include `caseID` and a `sourceId` in published payloads, and ignore events whose `sourceId` is your own, so a widget does not react to its own publish.
5. Treat a server push as an **invalidation signal**: refetch rather than trusting the payload.
6. Subscribe once per id; replacing a stored id without unsubscribing the old one leaks a subscription.
7. `PCore.getNetworkUtils().onStatusChange(cb)` returns an unsubscribe function; return it from the effect.

Only the `CASE` matcher of the messaging service is documented in the catalog. Other matchers (followers, tags, related cases and so on) exist in Pega's own widgets but are not documented, so do not rely on them without confirmation.

## Loading, offline and focus

- Use one Cosmos component per state: `Progress` (`placement` is `'block'`, `'local'` or `'inline'`), `EmptyState` (prop `message`), `Banner variant='urgent'` for errors, and `ErrorState` (`message`, `onRetry`) when a retry is possible. `Progress placement='local'` needs a `position: relative` parent with a minimum height.
- `Banner` variants set politeness: urgent and warning render `role='alert'` (assertive); the others are polite. Reserve urgent for real failures. `messages` is an array.
- `Progress` does not announce by itself in the build checked. Pair it with a polite status message.
- When a Refresh button replaces its own content, save `document.activeElement` before starting and restore focus afterwards, so keyboard users do not lose their place.
- Offline: if `PCore.getNetworkUtils()` reports offline, a Retry cannot show a spinner. Show a visible offline message with the Retry.
- Partial data: use `Promise.allSettled` for several independent requests so one rejected call hides only its own section. Do not map each rejection to `[]`.

## Mutations

- **Pessimistic by default:** call the API, then refetch (or prune local state) on success. Optimistic updates are only for upload placeholders (a row added at `progress: 0`, replaced from the server list, failed rows marked `error`).
- Show server errors in a `Banner`, never only `console.error`. Production widgets that only log leave the user with no feedback.
- Run a multi-call mutation with `Promise.all(...).finally(refetch)` so the list reloads even after a partial failure.
- Keep a per-action pending flag (ref plus state) so the control is disabled while the request runs.
- A mutation that does not resolve a promise the caller can await must still reset its pending flag in `.finally`.

### Confirm before delete

The catalog's `ConfirmDialogService` is global and last-write-wins, which is a poor fit for a reusable widget. Production widgets build the confirm from public Cosmos parts instead:

- A `Modal` with `heading`, a secondary Cancel `Button` and a `DangerButton` for the destructive action, created through `useModalManager()` (`create(Component, props, { alert: true })`) and closed with `useModalContext().dismiss()`.
- Route Esc, the overlay and the close button to the **cancel** path, and close the modal **before** starting the request.
- Keep the modal handle in a ref and ignore further requests while it is set.
- If the modal manager is not ready, **do not delete**. Production code that runs the action unconfirmed in that case is a trap, not a pattern.
- If the confirm is dismissed in any other way (including unmount), treat it as "go back" so caller state never hangs.
- After a delete, return focus: `SummaryList` and `ViewAll` take `deletedItemId`, `onDeleteFocusComplete` and `fallbackFocusRef` (the Add button) and do the work. Set `deletedItemId` before deleting and **clear it on cancel and on failure**, or focus handling stays armed.

## Lists, search and keys

- Cap a summary at a few rows with a "view all" action that opens the full list; keep search client-side inside the full list when the data is already loaded.
- Create a debounced handler **once** (`useMemo` or `useRef`), not in the render body: calling `debounce()` during render makes a new function each time and defeats it.
- Do not mutate filter or state objects in place and return the same object; a memoized child will miss the update.
- Use the source's own id as the list key. Do not use the index for a data-driven list. If ids contain characters that are unsafe for an HTML id (spaces, non-Latin1), encode them (`btoa(encodeURIComponent(id))`) and decode before any API call.
- A stable key by changing `key` on every refresh remounts every row and drops their state; avoid it.
- Show a count only when it is known; pass `undefined` while loading.

## i18n

Three channels exist. `pConn.getLocalizationService(localeRef?).getLocalizedText(text)` and `PCore.getLocaleUtils().getLocaleValue(key, category?, localeRef?)` are documented and public; the snake_case `useI18n` keys used inside Pega's own widgets are internal and a customer cannot add to them. Ship a `localizations.json` for your own strings. `getLocaleValue` has no placeholder engine: replace `{0}` yourself, and use two keys for singular and plural. Re-resolve labels when `locale` changes.

## Security

- Validate configured link targets before rendering them. Drop entries that fail the allow-list from [url](../../url/SKILL.md); `disallowedURI` from Cosmos is available in some builds.
- Open external links with `rel='noopener noreferrer'`; `window.open(url, '_blank')` needs `'noopener'`.
- `hasCreateAccess`-style filtering is a UX convenience, never authorization.
- Images stored in the application need an authenticated fetch; do not put a raw static-content path in an `<img src>`. Use `getSvcImageUrl` from the catalog and handle the loading and failure case.

## Traps seen in production widgets (do not copy)

1. Loading reset only in `.then`.
2. A mount flag kept in `useState`.
3. A fetch effect with no `catch`, no cleanup and a transient container that is never released.
4. Aborting on a new submit but not on unmount.
5. `debounce()` in the render body.
6. An `error` state that is never cleared by a later success.
7. Silent `console.error` on a failed mutation.
8. Fetch failures turned into `[]`.
9. Subscription leaks (a `subscribeOnce` per row, resubscribing every render, replacing an id without unsubscribing).
10. Confirm skipped when the modal manager is not ready.
11. `deletedItemId` left set after cancel or failure.
12. `Banner messages` passed a string instead of an array.
13. `Progress placement='local'` without a positioned parent.
14. Hook callbacks whose dependency arrays omit values they read (`useMemo` that is then mutated).
