---
name: date
description: 'Scaffold a Pega DX Field component with subtype **Date** — date or date-time input bound to a date case property. Use when: user asks for a date picker, calendar input, due date, birth date, date range endpoint, or a formatted date display.'
argument-hint: 'Describe the date field (e.g., "a due-date picker that blocks past dates")'
---

# Create Date Field

Field subtype `Date`. Binds to a date or date-time case property.

Read [../field/SKILL.md](../field/SKILL.md) for the shared Field rules first. This skill adds only what is specific to `Date`.

## Cosmos Mapping

| Mode | Component |
| --- | --- |
| Edit, date only | `DateInput` from `@pega/cosmos-react-core` |
| Edit, time only | `TimeInput` |
| `DISPLAY_ONLY` | `DateTimeDisplay` |

## Value Handling

- Pega stores dates as ISO-8601 strings. Keep the ISO string as the source of truth and never store a `Date` object in state.
- In Cosmos `DateInput`, `onChange` and `onBlur` receive an object `{ valueAsISOString, state }`, not a DOM event (verify against the installed `.d.ts`). A date-only value is the date part of that string:
  The date part is the text before `T` in `valueAsISOString`; an empty value is `''`. `state` is `'invalid'` or `'incomplete'` while the user is mid-entry. In that case keep the draft and call `getValidationApi().validate(...)`; commit with `changeNblur` only for a complete valid date. See Dates in [field-behavior.md](../create-dx-component/references/field-behavior.md).
- Use `dayjs` (already a dependency) for any comparison or arithmetic. Do not reach for `moment` or hand-rolled parsing.
- Format for display through `DateTimeDisplay` rather than formatting the string yourself, so the user's locale is respected.

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `minDate` | Earliest date | `TEXT` |  |  |
| `maxDate` | Latest date | `TEXT` |  |  |
| `showTime` | Include time | `BOOLEAN` | `false` |  |

## Gotchas

- Time zones are the main source of bugs. A date-only property must not be shifted by local offset: take the year with `value.slice(0, 4)` and, if you must parse, treat it as UTC (`dayjs.utc(value)`). `dayjs(value)` parses a bare date as local midnight and can cross a day boundary. A date-time value is a UTC instant; convert it with the operator's zone from `PCore.getEnvironmentInfo().getTimeZone()`.
- Set a sensible year range (default 100 years back, 20 forward), widened to include the stored value's year, so a legacy date is still displayed.
- An empty date must dispatch `''` or `null`, not the string `'Invalid Date'`.
- Relative bounds such as "no past dates" belong in the blur handler, not in `config.json`, since they are evaluated at runtime.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
