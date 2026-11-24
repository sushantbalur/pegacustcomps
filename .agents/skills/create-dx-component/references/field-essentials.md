# Field essentials

Read this instead of the deep references. Open one only for the cases listed at the end.

## Before you code

- States to cover (mark one not applicable with a reason): empty (`''`, `undefined`, `null`), populated, editing, invalid, required, disabled, read-only, display only, long or malformed value, narrow width, unchanged or empty blur. Add suggestion, field warning and `status` rows only if the field uses them.
- Each covered state gets a `mock.ts` fixture, a story and at least one test assertion.
- The scaffold is a working sample: start from it and replace demo content that does not serve the request.

## index.tsx

- `interface Props extends PConnFieldProps`; each extra prop is optional and named exactly like its `config.json` property. Export `withConfiguration(AcmeLibMyField)` (key without underscores).
- Keep `import '../shared/create-nonce';`. `PConnProps.d.ts` and `create-nonce.ts` live in `src/components/shared/`: never copy or edit them. `PCore` is a global; do not import it.
- `handleEvent` comes from `import handleEvent from './event-utils'`. If the scaffold did not create `event-utils.ts` (Text does not), copy `.claude/skills/create-dx-component/assets/event-utils.ts` into the component folder once; do not edit it.
- `propName` is `(pConn.getStateProps() as StateProps).value`.
- Config booleans can arrive as `'true'`: normalize `readOnly`, `required` and `disabled` with `value === true || value === 'true'`. Numeric config arrives as a string: `parseInt(x, 10)`, with a deliberate `NaN` fallback.
- `value` can be `null`, which a destructure default misses: `const value = valueProp ?? ''`.
- Commit with `handleEvent(actions, type, propName, value)`: `'change'` calls `updateFieldValue`, `'blur'` calls `triggerFieldChange`, `'changeNblur'` both.

| Control | While typing | On blur |
| --- | --- | --- |
| Text, TextArea, Email, URL | local draft, clear the error | `changeNblur` only if changed |
| Integer, Decimal, Percentage, Currency | validate draft, keep local | to number or `''`, compare, `changeNblur` |
| Date, DateTime, Time | commit only a complete valid value | same |
| Dropdown, RadioButtons, Checkbox | `changeNblur` on change | `validate(value)` (RadioButtons only when there is no value) |
| Stepper, slider | `changeNblur` on change | none |

- Read the blur value from the callback argument, not React state.
- Unchanged value: no commit, only `pConn.getValidationApi().validate(value)`. Both empty: `validate('')`, so required still reports.
- Zero is a value: never `if (!value)` for a number. Clear commits `''`, not `null` or `0`.
- Guard blur with `!readOnly`. On change call `pConn.clearErrorMessages({ property: propName })`. A local draft needs an effect on `[value]` that resyncs it.
- `info` is `validatemessage` if non-empty, else the field warning, else `helperText`. `status` is `'error'` with a `validatemessage`, `'pending'` for a suggestion, `'warning'` for a field warning, else `undefined`; never pass `'suggestion-accepted'` to Cosmos.
- Spread `{...additionalProps}` first; `testId={testId ?? label}`. `hideLabel` maps to `labelHidden`; the label stays the accessible name.
- `DISPLAY_ONLY` returns early, after all hooks, with no label or input. Empty renders `NoValue`; prefer the Cosmos `*Display` components (`undefined`, not `''`, for `NumberDisplay`, `CurrencyDisplay`).
- Cosmos-first: the control already handles label, required, disabled, readOnly, status, info and placeholder. Check any Cosmos prop you have not used in `node_modules/@pega/cosmos-react-core/lib/components/<Name>/<Name>.d.ts`.
- Look up every `PCore` and `pConn` call in [pcore-pconnect-apis.md](./pcore-pconnect-apis.md); use only documented methods.
- No inline `style={{ ... }}`, `dangerouslySetInnerHTML`, `console`, nested ternaries, `++`, index keys or dead code.

## config.json

- Start from the scaffolded file, never from memory. Add only properties the user confirmed, `label`, `hideLabel` and `readOnly` included.
- `index.tsx` reads every named property with a safe default, or `check-component.mjs` fails (`VISIBILITY`, `REQUIRED`, `DISABLED`, `READONLY` are platform-handled). Remove a property from config, props and code together.
- Order: `label`, `hideLabel`, `readOnly`; `GROUP` "Input settings" with `"visibility": "(!readOnly = true)"`; optional "Read-only settings"; `GROUP` "Conditions" (`REQUIRED` shown only when not read-only, `DISABLED`, `VISIBILITY`); collapsible `GROUP` "Advanced" with `testId`.
- `validate-schema` rejects missing `componentKey`, `name`, `description`, `type`, `subtype` or `properties`, a wrong subtype or casing, a property lacking `name`, `label` or `format`, and duplicates. It does not check `format`: use only scaffold formats.
- `name` equals `componentKey` and the folder. `SELECT` needs `source: [{ key, value }]`; `GROUP` has no `name`; `NUMBER` defaults are numbers, not strings. Labels are sentence case without `@L`; `@L` marks `defaultConfig` values.

## styles.ts

- Keep the single default-exported `styled.div` wrapper.
- Add rules only for what Cosmos cannot express (animation, missing states); never layout, text, badges or loading.
- The theme is undefined here: `useTheme()` in `index.tsx`, pass values as transient props (`$error`).
- Delete selectors for markup that is gone.

## mock.ts and demo.stories.tsx

- `mock.ts` exports `configProps` (keys mirror `config.json`, resolved, never `@L`) and `stateProps = { value: '.PropertyName' }`.
- Base story is `Base<InnerFunctionName>`; one story per covered state.
- Meta `argTypes` gives every `config.json` property a matching control ([storybook-pattern.md](./storybook-pattern.md#controls-argtypes)); hide `getPConnect`.
- The fake `getPConnect` has exactly the methods the component calls; `updateFieldValue` updates story state; forward `triggerFieldChange` to a story-only arg. Empty callbacks need `/* nothing */`.

## demo.test.tsx

- Query by role and accessible name (`getByRole('textbox', { name: /email/i })`); needing a test id is an accessibility finding. Use `fireEvent` (no `user-event`).
- One assertion per covered state: label, hidden label with helper text; `required`, `disabled` (`toBeRequired()`, `toBeDisabled()`), `readOnly`; `DISPLAY_ONLY` with and without a value; `validatemessage` replacing `helperText` (assert `toHaveAccessibleDescription`; Cosmos sets `aria-describedby`, not `aria-invalid`); `null`, `''`, `0`, typed over `null`; change does not commit; blur commits `propName` and value; unchanged blur only validates; clear commits `''`; long value.
- Toggle props with `rerender`; pass story-only args through a `Record<string, unknown>` spread. Never weaken an assertion to pass.

## localizations.json

- Text the field shows itself goes through `pConn.getLocalizationService().getLocalizedText('English text')` and is listed under `fields` in `localizations.json` next to `index.tsx` as `"English text": "English text"`, kept in step with the code.
- Use whole sentences with `{0}` placeholders; plurals are separate keys; never translate data.

## Open a deep reference only when

| Situation | Read |
| --- | --- |
| Dates, time zones, numbers, precision, pickers, URL/email/phone, suggestions, field warnings | [field-behavior.md](./field-behavior.md) |
| Text-Input, Text-Paragraph, Icon-Button-URL, DateTime, TimeOfDay, Picklist-Autocomplete | [field-subtypes-extra.md](./field-subtypes-extra.md) |
| A subtype with its own skill | e.g. [text](../../text/SKILL.md), [picklist](../../picklist/SKILL.md) |
| A config format beyond the scaffold's, visibility, bindings | [config-schema.md](./config-schema.md) |
| A failing or async test, jsdom stubs, a fuller story fake | [test-pattern.md](./test-pattern.md), [storybook-pattern.md](./storybook-pattern.md) |
| A Cosmos component you have not used before | [cosmos-components.md](./cosmos-components.md) |
| Focus, keyboard, announcements, manual checks | [accessibility.md](./accessibility.md) |
| Placeholders, plurals, formatting, right-to-left | [localization.md](./localization.md) |
| Full prop list or code skeleton | [props-contract.md](./props-contract.md), [component-patterns.md](./component-patterns.md), [styles-pattern.md](./styles-pattern.md) |
| A custom control or unclear subtype | [choosing-type-and-subtype.md](./choosing-type-and-subtype.md) |
| AI-generated content | [state-matrix.md](./state-matrix.md) |
| A worked example | [field-with-limits-and-validation.md](../cookbooks/field-with-limits-and-validation.md) |

Finish with `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>`; see [cli-workflow.md](./cli-workflow.md).
