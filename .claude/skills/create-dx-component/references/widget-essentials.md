# Widget essentials

Read this instead of the deep references for a typical widget. Open a deep reference only for the cases listed at the end.

## Before you code

- States to cover (mark one not applicable with a reason): initial loading, loaded, empty ("no results" distinct from "not configured"), error with retry, refreshing, stale or late response, action pending, failed mutation, offline, long content, narrow width. Partial data and permission-limited apply only with sections or a restricting source.
- Each covered state gets a `mock.ts` fixture, a story and at least one test assertion.
- Start from the scaffolded files; the scaffold is a working sample, replace demo content that does not serve the request.

## index.tsx

- `interface Props extends PConnFieldProps`; each extra prop is optional, named like its `config.json` property, with a safe default. Export `withConfiguration(AcmeLibMyWidget)`; keep `import '../shared/create-nonce';`. `PCore` is a global; do not import it.
- Model one status (`'loading' | 'error' | 'empty' | 'success'`), not independent booleans.
- Fetch in `useEffect` with `PCore.getDataApiUtils().getData(dataPage, payload, context)`, `context` from `pConn.getContextName()`. Set status to `'loading'` and clear the previous error at the start of each fetch. Depend on the inputs; for an object input, put `JSON.stringify(obj)` in the dependency array and read the object from a ref inside the effect.
- Case ID: `pConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID, '')`; skip the fetch until it is non-empty.
- Guard every async result with a local `let isMounted = true` cleared in the effect cleanup (never `useState`), so a response after unmount or a dependency change is ignored.
- Reset loading in `.finally` (or both `.then` and `.catch`). A failure sets `'error'`, never `[]`. Read `response.data?.data ?? []`; a `null` list is empty. A missing data source is a different empty.
- Map the response in one pure function (guard `Array.isArray` and missing fields).
- Retry re-runs the effect (an attempt counter); a later success clears `'error'`.
- Refresh keeps previous rows visible with a busy indicator; a count is `undefined` while loading, not `0`.
- Search: a new `AbortController` per request, aborting the previous; cancellation is not an error and does not reset loading. Create a debounce once (`useMemo`), never in render.
- A secondary request (a count, an optional section) must not fail the widget; use `Promise.allSettled` for sections.
- Duplicate-click guard: a ref flag set synchronously, reset in `.finally`; state drives only the disabled or busy UI.
- Mutations are pessimistic: call, then refetch or prune on success. Show failures in a `Banner`, never only `console`; re-enable the control.
- Subscriptions: a unique subscriber name per instance (`createUID()` in a ref); unsubscribe in cleanup with the same name and `contextName`; key the effect on its ids; treat a push as a signal to refetch. `PCore.getNetworkUtils().onStatusChange(cb)` returns an unsubscribe function: return it from the effect.
- Layout: `Card`, `CardHeader` (`Text variant='h2'` title), `CardContent`. States: `Progress` plus a polite status message, `EmptyState` (`message`), `Banner variant='urgent'` (`messages` array) or `ErrorState` (`message`, `onRetry`). Offline shows a visible message with Retry, not a spinner.
- Key rows by the source id, not the index. Links: allow only `http:` and `https:`, with `rel='noopener noreferrer'`.
- Announce state changes without moving focus; `aria-busy` while refreshing. Repeated buttons need distinct names; a chart needs a text alternative.
- Write-back to a bound property: `updateFieldValue`, then `triggerFieldChange`; keep the source shape.
- Cosmos-first; check any new Cosmos prop in its `.d.ts` in `node_modules`. Look up every `PCore` and `pConn` call in [pcore-pconnect-apis.md](./pcore-pconnect-apis.md); use only documented methods.
- No inline `style={{ ... }}`, `dangerouslySetInnerHTML`, `console`, nested ternaries, `++` or dead code.

## config.json

- Start from the scaffolded file, never from memory. Keep `type: "Widget"` and the scaffolded `subtype`.
- Add only properties the user confirmed; `index.tsx` reads every named one with a safe default, or `check-component.mjs` fails. Remove a property from config, props and code together.
- `validate-schema` rejects missing required keys, a wrong subtype, a property lacking `name`, `label` or `format`, and duplicates. It does not check `format`: use only scaffold formats.
- Property names are camelCase; labels sentence case without `@L`. `defaultConfig` holds `@L` defaults (`"label": "@L My widget"`) and bindings such as `"@DATASOURCE D_Name.pxResults"`.
- `SELECT` needs `source: [{ key, value }]`; parse `NUMBER` values in code.
- No runtime state, secrets, tokens or per-environment URLs in config or anywhere in the component folder (`check-component.mjs` fails).

## styles.ts

- Keep the single default-exported `styled.div` wrapper.
- Rules only for what Cosmos cannot express (animation, SVG, drag states); never layout, cards, text, badges or loading.
- The theme is undefined here: `useTheme()` in `index.tsx`, pass values as transient props.
- `Progress placement='local'` needs a positioned parent with a minimum height; delete selectors for markup that is gone.

## mock.ts and demo.stories.tsx

- `mock.ts` exports `configProps` (keys mirror `config.json`, resolved, never `@L`) and realistic data in the `getData` shape `{ data: { data: [...] } }`.
- Fake `PCore` through `globalThis` (`(globalThis as unknown as { PCore: unknown }).PCore = { ... }`; `window.PCore = ...` fails `tsc`): `getConstants`, `getLocaleUtils`, `getDataApiUtils().getData`, and anything else it calls.
- The fake `getPConnect` has exactly the methods the component calls.
- Base story is `Base<InnerFunctionName>`; one story per state, each resolving or rejecting the fake call.
- Meta `argTypes` gives every `config.json` property a matching control ([storybook-pattern.md](./storybook-pattern.md#controls-argtypes)); hide `getPConnect` and `datasource`.

## demo.test.tsx

- Query by role and accessible name (`getByRole('button', { name: /try again/i })`); needing a test id is an accessibility finding. Use `findBy*` for async results and `fireEvent` (no `user-event`).
- One assertion per covered state: loading, data, empty (`null` and `[]`), error; retry from error; late response after unmount or a prop change ignored; refresh keeps rows; a double click sends one request; unsubscribe on unmount with the same name and context; a failed mutation shows a message and re-enables the control.
- Assert announcements (`findByRole('status')`, `getByRole('alert')`) and `aria-busy`. Use fake timers with `act` for debounce. Never weaken an assertion.

## localizations.json

- Every visible string, `aria-label`s included, goes through `getLocalizedText` and is listed under `fields` as `"English text": "English text"`, in step with the code.
- Use whole sentences with `{0}` placeholders; plurals are separate keys; do not translate data or cache translated text.

## Open a deep reference only when

| Situation | Read |
| --- | --- |
| Summary then expand, confirm before delete, subscription details, focus after delete, security | [widget-patterns.md](./widget-patterns.md) |
| A complete fetch example | [build-a-data-widget.md](../cookbooks/build-a-data-widget.md) |
| A CASE or PAGE specific rule | [case](../../case/SKILL.md), [page-widget](../../page-widget/SKILL.md) |
| A config format beyond the scaffold's, visibility, bindings | [config-schema.md](./config-schema.md) |
| A failing or async test, jsdom stubs, a fuller story fake | [test-pattern.md](./test-pattern.md), [storybook-pattern.md](./storybook-pattern.md) |
| A Cosmos component you have not used before, theme palette keys | [cosmos-components.md](./cosmos-components.md), [styles-pattern.md](./styles-pattern.md) |
| Focus, headings, announcements, manual checks | [accessibility.md](./accessibility.md) |
| Placeholders, plurals, formatting | [localization.md](./localization.md) |
| Full prop list or skeleton | [props-contract.md](./props-contract.md), [component-patterns.md](./component-patterns.md) |
| AI-generated content, or the full state list | [state-matrix.md](./state-matrix.md) |

Finish with `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>`; see [cli-workflow.md](./cli-workflow.md).
