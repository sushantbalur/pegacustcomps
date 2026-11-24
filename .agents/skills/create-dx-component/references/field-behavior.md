# Field Behavior

How production Constellation Fields commit values, handle empty and zero, and report status. This is the shared contract behind every Field subtype skill; the subtype skills only add what differs. Props and display modes are in [props-contract.md](./props-contract.md), states in [state-matrix.md](./state-matrix.md).

The behaviors below were observed in Pega's own Field components. Cosmos callback shapes can differ between Cosmos versions, so check the control's `.d.ts` in the installed `@pega/cosmos-react-core` before relying on a shape (see Verified Gotchas in [cosmos-components.md](./cosmos-components.md)).

## Commit protocol

`handleEvent(actions, type, propName, value, options?)` from `shared/event-utils` maps to the PConnect actions API:

| `type` | Calls |
| --- | --- |
| `'change'` | `updateFieldValue(prop, value, options)` |
| `'blur'` | `triggerFieldChange(prop, value)` |
| `'changeNblur'` | both, in that order |

Which event commits depends on the control. Follow the contract for the subtype instead of committing on every keystroke:

| Family | While typing | On blur |
| --- | --- | --- |
| Text, TextArea, Email, URL | keep a local draft, clear the field error, `pConn.updateDirtyCheckChangeList(propName, draft)` | commit with `changeNblur` only if the value differs from the stored one |
| Integer, Decimal, Percentage, Currency | validate the draft, keep it local, clear the field error | convert to a number (or `''`), compare, `changeNblur` if different |
| Date, DateTime, Time | pickers commit when a complete valid date is entered (see Dates) | same helper |
| Dropdown, RadioButtons, Checkbox | `changeNblur` straight from the change event | `validate(value)` (RadioButtons only when there is no value) |
| Stepper or slider variants | `changeNblur` on change, because they may never fire blur | none |

Rules that apply to every family:

- **Read the value from the control's blur callback argument, not from React state.** State may not have updated yet; a decimal point inserted into `805` to make `8.05` must still commit.
- **Do nothing when the value is unchanged.** If the draft equals the stored value, do not commit. If both are empty, call `getValidationApi().validate('')` only, so a required field still reports its error.
- **Zero is a value.** Never write `if (!value)` for a number. Typing `0` over an empty field commits `0`; clearing a stored `0` commits `''`.
- **Compare as strings (or the parsed form), never with epsilon.** Compare `value.toString()` with the parsed text, so `1.600` redisplays as `1.6` after commit.
- **Clear means `''`.** Production numeric fields send `''` (not `null`, not `0`) when the user clears the input. See [Empty and null](#empty-and-null).
- **Guard blur with `!readOnly`** so a read-only control cannot commit.
- **Wire error clearing and the dirty list.** On change call `pConn.clearErrorMessages({ property: propName })` (documented), so a stale error disappears as soon as the user edits. Pega's own fields that keep a local draft also call `pConn.updateDirtyCheckChangeList(propName, value)`. That method is in the PConnect typedefs but **not in the API catalog**: confirm it in `node_modules/@pega/pcore-pconnect-typedefs`, and tell the user you are using it, before adding it.
- **Local draft state needs a sync effect.** Keep `useState(String(value))` for the control and an effect on `[value]` that overwrites it when the store changes (a reset, a cascade, a suggestion accepted).

## Empty and null

`value` can be `null` for a property that was never set. A destructure default (`value = ''`) does not cover `null`; use `const value = valueProp ?? ''`.

Test these inputs for every numeric and text field: `null`, `''`, `0`, a stored value, and a typed value over `null`.

| Subtype | `null` mounts as | Notes |
| --- | --- | --- |
| Text, Integer, Decimal, Currency, Percentage | empty input | display mode shows `NoValue` (Text shows `0` for a real zero) |
| Boolean checkbox | unchecked | writes `false` with `{ skipDirtyValidation: true }` so the form is not dirtied; no `triggerFieldChange` |
| Boolean as two radios | neither selected | skip the null-to-false write so "unset" stays distinct from "false" |
| Picklist | first option, or `''` when a placeholder exists | see [picklist](../../picklist/SKILL.md) |

## Message precedence

- `info` shown under the control is `validatemessage` if non-empty, else the field warning content, else `helperText`. A validation message **replaces** the helper text.
- `status` passed to the Cosmos control: `'error'` when `validatemessage` is non-empty, `'pending'` while a suggestion is available, `'warning'` for a field warning, otherwise `undefined`. Never pass the internal value `'suggestion-accepted'` to a Cosmos control; map it to `undefined`.
- **Field warning.** `showFieldMessage` plus `messageConfig: { visibility, content }` shows a non-blocking warning when `showFieldMessage && messageConfig.visibility && !readOnly`. It is suppressed in read-only mode and when the condition is false.
- `hideLabel` hides the label (`labelHidden`) but helper text still renders.
- `fieldMetadata` may carry `maxLength`, `additionalInformation` (render as the control's `additionalInfo={{ content }}`) and `inputFormat.pattern` (a mask). `pConn.getFieldMetadata(prop)` returns it; the scaffolds already receive it as a prop. The method is typed in the PConnect typedefs but is not in the API catalog, so prefer the prop, and confirm the method in the typedefs before calling it.

## Boolean-like props arrive as strings

`readOnly`, `required` and `disabled` can arrive as `true`, `'true'` or anything else. Normalize each with `p === true || p === 'true'`. Numeric config such as `decimalPrecision` or `pickerInterval` arrives as a string too; `parseInt` it and fall back deliberately when it is `NaN`.

## `additionalProps`

Spread `{...additionalProps}` **first** on the Cosmos control so explicit props win. `autoFocus` and similar platform props arrive this way. Give the control `testId={testId ?? label}` so tests and test automation have a stable hook.

## Suggestions (AI-assisted values)

When the platform proposes a value, `pConn.acceptSuggestion()` and `pConn.ignoreSuggestion()` (both in the catalog) accept or reject it. Pass `suggestion={{ onAccept, onReject }}` to the Cosmos control, and keep a local `status` that becomes `'suggestion-accepted'` on accept and is cleared on reject, on user edit and after the blur commit. For a Checkbox or radio, call `onAccept` when the click changes the suggested value, otherwise `onReject`. Show the pending status only when the suggested value is among the options.

## Display only

`DISPLAY_ONLY` returns early, after all hooks, with no label or input. An empty value renders `NoValue`. Numeric displays pass `undefined` (not `''`) to `NumberDisplay` or `CurrencyDisplay`. The Cosmos `*Display` components (`DateTimeDisplay`, `CurrencyDisplay`, `NumberDisplay`, `EmailDisplay`, `PhoneDisplay`, `BooleanDisplay`, `ParagraphDisplay`, `URLDisplay`) format values for you; prefer them to formatting by hand. The optional `formatter` prop maps to display variants (for example `Currency`, `Decimal`, `Percentage`, `DateTime-Long`); read it from `pConn.getConfigProps()` at render time.

## Dates, times and time zones

- **Date** values are `YYYY-MM-DD` strings. Never run them through a time zone: parsing `2024-03-01` as local midnight can shift the day. Take the year with `value.slice(0, 4)` and format date-only values with `timeZone: 'UTC'`.
- **DateTime** values are UTC instants (`YYYY-MM-DDTHH:mm:ss.000Z`). Convert to the operator's zone for the input and back to UTC on commit. The zone comes from `PCore.getEnvironmentInfo().getTimeZone()`; when that is empty and the feature flag `pyEnableDateTimeSystemTimezoneFallback` is on in `getEnvironmentInfo().getFeatureMap()`, fall back to `PCore.getLocaleUtils().getTimeZoneInUse()`.
- **Time** values are `HH:mm:ss` and commit on blur.
- **Year range.** Defaults are 100 years back and 20 years forward from today, widened to include the year of the stored value. `min` is `${year}-01-01` and `max` is `${year}-12-31`.
- **Invalid and incomplete input.** Cosmos date inputs report an error state alongside the value. While the state is invalid or incomplete, keep the draft and call `validate(...)`; do not call `triggerFieldChange`, and do not clear what the user typed. Only a complete valid date is committed.
- **DateTime options.** `pickerInterval` accepts only 5, 10, 15, 20, 30 or 60 (fall back to 30). `clockFormat` accepts 12 or 24 (fall back to the locale default).
- Use `LocaleOverride` from Cosmos for a calendar override, and read the locale from `PCore.getEnvironmentInfo().getLocale()`.

## Numbers

- Integer: accept `''`, `'-'`, or text where `Number(s).toString() === s`. That rejects `1.0`, `01` and `1e3` while typing. `showGroupSeparators` defaults to true.
- Decimal: `numberOfDecimals` is `parseInt(decimalPrecision)`. `NaN` from `''` means unlimited, any other `NaN` means 2. Intermediate drafts such as `-`, `-0`, `-0.` and `-0.0` must survive typing, which is why a draft is validated by its trimmed form rather than by `Number()`. Cosmos `NumberInput` already caps the length.
- Currency: use the authored `currencyISOCode` prop. Fall back to `PCore.getFieldDefaultUtils().fieldDefaults.Currency.currencyISOCode`, then `'USD'`. Check that a code is valid with `new Intl.NumberFormat('en', { style: 'currency', currency: code })` in a try/catch.
- Percentage: a platform default (`PCore.getFieldDefaultUtils().fieldDefaults.Percentage.storePercentageAsDecimal`) decides whether `0.25` or `25` is stored. When it is on, display is `value * 100` and commit is `value / 100` rounded to `precision + 2` decimals. Watch the precision fallback: a stored `0.123456` with an empty precision displays as `12.35`.

## Pickers and radios

- Compare option keys as strings: `` `${value}` === `${item.key}` ``. Never key a radio by array index; use the key, and name the group `pageReference.propName` so groups on different pages do not collide.
- A placeholder is an option with value `''`. With no placeholder and an empty value, production selects the first option and commits it; if the stored value is not among the options it resets to the first option (or `''` with a placeholder). Decide on purpose whether your picker does this, and test it.
- Dependent options: register through the cascade APIs and cancel stale option requests with an `AbortController` before each search.
- A single-select combo box keeps the typed filter text separate from the selected item, and clearing the text deselects.
- A picker that also writes other properties from the selected row calls `updateFieldValue(prop, v)` then `triggerFieldChange(prop, v, true)` for each extra property; the third argument skips validation.
- Radio deselect is an opt-in (`allowClear`), not the default.

## URL, email and phone

- A display link built by Cosmos `URLDisplay` is not a security boundary. In the Cosmos build checked here, `Link` only drops hrefs that match `javascript:`; `data:`, `vbscript:` and `file:` pass through. Validate scheme yourself (allow `http:`, `https:` and `mailto:` as needed) and test `disallowedURI` from Cosmos where it exists. Open external links with `rel='noopener noreferrer'`.
- Phone: `PhoneInput` emits country code plus number. A value holding only a country code is junk: on mount write `''` and remember the code locally, and make `required` reject it. Use `getPhoneNumberParts` from Cosmos to split a value.
- Email and URL commit the raw string like Text. Trimming or lowercasing is your design choice, not platform behavior; say so in the contract.

## Handler shapes

Reference examples for the rules above. Adapt them; do not paste them over the scaffold.

A numeric blur handler (Integer, Decimal, Currency, Percentage):

```typescript
const onBlur = (event) => {
  const entered = event.target.value; // read from the event, not from state
  const next = entered !== '' ? Number(entered) : '';
  if (String(valueProp ?? '') !== String(next)) {
    handleEvent(actions, 'changeNblur', propName, next);
  } else {
    pConn.getValidationApi().validate(entered); // unchanged or still empty: validate only
  }
};
```

A date callback (Cosmos `DateInput`; verify the shape in the installed `.d.ts`):

```typescript
const { valueAsISOString, state } = callbackValue;
const date = valueAsISOString ? valueAsISOString.split('T')[0] : '';
// state is 'invalid' or 'incomplete' while the user is mid-entry: keep the draft and validate; commit only a complete date
```

A URL allow-list:

```typescript
const isSafe = (raw: string) => {
  try {
    return ['http:', 'https:'].includes(new URL(raw).protocol);
  } catch {
    return false;
  }
};
```

An email normalizer (only if the user agrees to normalize stored data):

```typescript
const normalized = (value ?? '').trim().toLowerCase();
handleEvent(actions, 'blur', propName, normalized);
pConn.getValidationApi().validate(normalized);
```

## Verification checklist

For every Field, the matching story and test should cover: label, required, disabled, read-only, display only, helper text, validation message replacing helper text, zero, `null`, empty, typing over `null`, unchanged blur (no commit), empty blur (validate only), the commit arguments, and a long value. Details in [test-pattern.md](./test-pattern.md).
