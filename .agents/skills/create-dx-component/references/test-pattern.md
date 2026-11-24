# Test Pattern

## Standard Jest Test File (demo.test.tsx)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';

const { BaseAcmeLibComponentName } = composeStories(DemoStories);

test('renders AcmeLibComponentName', async () => {
  render(<BaseAcmeLibComponentName />);
  // Assert component renders with expected content
  expect(await screen.findByText('Expected Label')).toBeVisible();
});

test('handles user interaction', async () => {
  render(<BaseAcmeLibComponentName />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'new value' } });
  // Assert state change
});

test('renders in display mode', async () => {
  render(<BaseAcmeLibComponentName displayMode="DISPLAY_ONLY" />);
  // Assert display-only rendering
});
```

## Testing Patterns by Component Type

### Field Component Tests
```typescript
test('renders field with label and value', async () => {
  render(<BaseAcmeLibMyField />);
  expect(await screen.findByText('Field Label')).toBeVisible();
});

test('handles value change', async () => {
  render(<BaseAcmeLibMyField />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'test' } });
  expect(input).toHaveValue('test');
});

test('shows validation error', async () => {
  render(<BaseAcmeLibMyField validatemessage="Required field" />);
  expect(await screen.findByText('Required field')).toBeVisible();
});

test('renders as read-only', async () => {
  render(<BaseAcmeLibMyField readOnly />);
  const input = screen.getByRole('textbox');
  expect(input).toHaveAttribute('readonly');
});
```

### Widget Component Tests
```typescript
test('renders widget with loading state', async () => {
  render(<BaseAcmeLibMyWidget />);
  // Widget shows data after async load
  expect(await screen.findByText('Widget Title')).toBeVisible();
});

test('renders widget data', async () => {
  render(<BaseAcmeLibMyWidget />);
  // Wait for async data
  expect(await screen.findByText('Expected Data')).toBeVisible();
});
```

### Template Component Tests
```typescript
test('renders template with children', async () => {
  render(<BaseAcmeLibMyTemplate />);
  expect(await screen.findByText('Child 1')).toBeVisible();
  expect(await screen.findByText('Child 2')).toBeVisible();
});

test('renders correct number of columns', async () => {
  render(<BaseAcmeLibMyTemplate NumCols="3" />);
  const grid = screen.getByTestId('column-count-3');
  expect(grid).toBeInTheDocument();
});
```

## Key Testing Utilities

- `render()` — Render component
- `screen.findByText()` — Async query (waits for element)
- `screen.getByRole()` — Query by ARIA role
- `screen.getByTestId()` — Query by data-testid attribute
- `fireEvent.change()` — Simulate input change
- `fireEvent.click()` — Simulate click
- `fireEvent.blur()` — Simulate blur

## Coverage Requirements

From jest.config.cjs:
- Statements: 79%
- Branches: 74%
- Functions: 81%
- Lines: 80%

## Rules (verified by running generated components)

1. **Mock exactly what the component calls.** If you add a call to `pConn.getValue`, `pConn.getContextName`, `PCore.getDataApiUtils` or any other API, add a fake for it to the story's `getPConnect` (or to `PCore`) in the same change. A missing fake shows up as `TypeError: ... is not a function` in the test. Look up the real names in the [API catalog](../../README.md) so the fake matches a method that exists.
2. **Update `mock.ts` and the expected text together.** The scaffolded test asserts specific strings from `mock.ts` and the story args (for example the label `Text Sample`). If you change what the component renders, update the data and the assertions so they describe the new behavior. Do not delete assertions to make a test pass.
3. **Assert on what the user sees**: text, roles, test ids and emitted calls. Do not assert on internal state.
4. **Cover the modes your component supports**: editable, `DISPLAY_ONLY`, `readOnly`, `disabled`, and an error state (`validatemessage` set).
5. **Cover the async states for widgets**: loading, data, empty (`data` is `null` or `[]`) and error (the promise rejects). Drive each state with its own story, resolving or rejecting the fake data call.
6. **Check the write path for editable fields.** Forward the fake `triggerFieldChange` to a story-only arg and assert it was called with the property name from `stateProps` and the new value. Pass the arg through a `Record<string, unknown>` spread so `tsc` stays clean without adding a test-only prop to the component:

   ```tsx
   const onTriggerFieldChange = jest.fn();
   const storyArgs: Record<string, unknown> = { onTriggerFieldChange };
   render(<BaseAcmeLibMyField {...storyArgs} />);
   fireEvent.change(getInput(), { target: { value: 'abc' } });
   fireEvent.blur(getInput());
   expect(onTriggerFieldChange).toHaveBeenCalledWith('.TextSample', 'abc');
   ```

7. **Fake `PCore` through `globalThis`** in new stories. `src/globals.d.ts` declares `PCore` as a global constant, so assigning `window.PCore = ...` is a `tsc` error:

   ```ts
   (globalThis as unknown as { PCore: unknown }).PCore = { getDataApiUtils: () => ({ getData }) };
   ```

8. Use `fireEvent` from `@testing-library/react`; the template does not install `@testing-library/user-event`.
9. `ErrorState` renders its retry button as "Try again". Query design-system controls by role and name (`screen.getByRole('button', { name: /try again/i })`).

10. **Build props with a factory that takes overrides.** One `getDefaultProps(overrides = {})` per test file keeps each test independent. Create `jest.fn()` only for calls you assert on, declare them inside the test, and clear them in `afterEach(jest.clearAllMocks)`.
11. **Toggle with `rerender`.** Test `required`, `disabled`, `readOnly`, `hideLabel` and `displayMode` by rendering once and calling `rerender` with changed props, so the test proves the component reacts to a prop change, not just to its first render.
12. **Treat the fake `getPConnect` as the contract.** A method the component calls and the fake lacks throws, which tells you exactly what the component depends on. Keep the fake minimal so the test fails when a new dependency appears.
13. **Query by role and accessible name first**; a test that needs a test id because no role or name exists is an accessibility finding (see [accessibility.md](./accessibility.md)). When you do use a test id, set it yourself through the `testId` prop; with no `testId` the component should fall back to a sensible default or render none, and a test should say which.

## Behavior checklist

Cover each row that applies, with the same names in the story and the test. The field rows come from [field-behavior.md](./field-behavior.md), the widget rows from [widget-patterns.md](./widget-patterns.md).

| Type | Cases |
| --- | --- |
| Field | label shown, and hidden with `hideLabel` (helper text still shown) · `required`, `disabled`, `readOnly` · `DISPLAY_ONLY` with a value and with none · `validatemessage` shown and **replacing** `helperText` · placeholder · `value` of `null`, `''`, `0`, a stored value, and a typed value over `null` · change updates the draft without committing · blur commits with the property name and value · blur with an **unchanged** value does not commit but still validates · blur with an **empty** unchanged value validates `''` · clear commits `''` · long value does not break layout |
| Widget | each status (loading, data, empty, error) driven by its own resolved or rejected fake · retry from error · a response that arrives after unmount or after a prop change is ignored · refresh keeps the old rows visible · duplicate click on an async action sends one request · unsubscribe called on unmount with the same name and context · a failed mutation shows a message and re-enables the control |
| Template | all regions populated · an empty optional region · all children hidden hides the heading · read-only mode forces `readOnly` and `displayMode` on children (`setInheritedProp` called with both) · column count from config, including a string `'2'` and a missing value · region found by name when the order differs |

## Testing `config.json`

A cheap structural test catches drift between `config.json` and the component. Read the file with `fs.readFileSync` and `JSON.parse` (this avoids needing `resolveJsonModule`), then assert on the property tree: find a `GROUP` by label, check a `SELECT`'s option keys, check that a conditional property has the expected `visibility`, and check that **every `name` in `properties` is a prop the component reads**. Walk nested `GROUP` entries when collecting names. This is the fastest guard against the property drift described in [config-schema.md](./config-schema.md).

## Running tests

```bash
npm run test                                          # every demo.test.tsx, with coverage thresholds
npx jest src/components/<Org>_<Library>_<Name> --coverage=false   # one component, no coverage gate
```

`jest.config.cjs` uses `jsdom`, `ts-jest` and `setupTests.ts`. `setupTests.ts` stubs `fetch`, `ResizeObserver`, `IntersectionObserver`, canvas and the `Highlight` global that `@pega/cosmos-react-core` needs under jsdom. If a design-system component fails under jsdom with `X is not defined`, add a minimal stub to `setupTests.ts` rather than skipping the test.

## Type checking stories

Stories and tests are excluded from ESLint and from the component bundle. Scaffolded Widget and Template stories can still report `tsc` errors such as `Property 'PCore' does not exist on type 'Window'`. Those are known; filter them with `npx tsc --noEmit 2>&1 | grep -v demo.stories.tsx`. Do not add `@ts-ignore` to production code to match them.

## Coverage does not gate component code

⚠️ **They do not currently gate component code.** `collectCoverageFrom` is scoped to `./node_modules/@pega/custom-dx-components/src/*.js`, so nothing under `src/components/` is instrumented and the report reads `0%` across the board. Treat the numbers below as the standard to write to, not as something the tooling will catch for you.

## jsdom gaps


[setupTests.ts](../../../../setupTests.ts) stubs browser APIs that jsdom lacks but Cosmos uses at **module scope**, so importing `@pega/cosmos-react-core` throws without them:

- `Highlight` and `CSS.highlights` — CSS Custom Highlight API
- `Element.prototype.animate` — Web Animations API, called by `Modal` on mount
- `ResizeObserver`, `IntersectionObserver`, `matchMedia`, `URL.createObjectURL`

If a new Cosmos component fails with `X is not defined` or `.someApi is not a function` from inside `node_modules`, add the stub there rather than working around it in the component.

## Timers and randomness


```typescript
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});
```

Wrap timer advances in `act(() => { jest.advanceTimersByTime(1000); })`. Stub non-determinism with `jest.spyOn(Math, 'random').mockReturnValue(0)`.

## Queries and assertions


Prefer, in order: `getByRole` → `getByText` → `getByTestId`. Use `findBy*` when the result depends on a resolved promise.

Assert with `toBeVisible`, `toBeEnabled`, `toBeDisabled`, `toHaveValue`, `toHaveAttribute`, `toBeInTheDocument`.

Drive interaction with `fireEvent.click`, `fireEvent.change(input, { target: { value: 'x' } })`, and `fireEvent.blur(input)`.

## Conventions


- One `describe` per component, named after the inner function.
- Test names describe observable behaviour, not implementation.
- Assert on rendered output. Assert on a mocked call only when it is the behavior under test (for example that `triggerFieldChange` was called with the property name and the new value after a blur); never assert on how a mock was wired — that tests the mock.
- Drive branches through **real config props**, not synthetic test-only props. A prop that exists just for a test will fail `tsc` because it is not on the component's `Props`.
- Do not lower the thresholds in [jest.config.cjs](../../../../jest.config.cjs) to make a suite pass.
