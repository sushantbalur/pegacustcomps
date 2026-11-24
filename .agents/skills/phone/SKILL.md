---
name: phone
description: 'Scaffold a Pega DX Field component with subtype **Phone** — telephone number input bound to a string case property. Use when: user asks for a phone input, mobile number, country-code selector, tel link display, or phone formatting.'
argument-hint: 'Describe the phone field (e.g., "a mobile number input defaulting to +1")'
---

# Create Phone Field

Field subtype `Phone`. Binds to a string case property holding a telephone number.

Read [../field/SKILL.md](../field/SKILL.md) for the shared Field rules first. This skill adds only what is specific to `Phone`.

## Cosmos Mapping

| Mode | Component |
| --- | --- |
| Edit | `PhoneInput` from `@pega/cosmos-react-core` |
| `DISPLAY_ONLY` | `PhoneDisplay` — renders a `tel:` link |

## Value Handling

- Prefer an E.164-style value (`+15551234567`) in the case property, and confirm the format with the user, because the platform's own Phone field stores whatever `PhoneInput` emits and does no extra normalization. Display formatting is a render concern, not a storage concern.
- `PhoneInput` handles the country selector and the display mask. Read its emitted value and dispatch it unchanged. `getPhoneNumberParts(value, callingCodes)` from Cosmos splits a value into `[countryCode, number]`.
- **A value that is only a country code is junk.** On mount, if the stored value equals its own country code, write `''` and remember the code in local state; on change, treat a value with no subscriber digits as `''`. After the user clears the number the country selector should still show the chosen code.
- Commit on blur like Text: empty and unchanged runs `validate('')` only, a changed value uses `changeNblur`, and an unchanged non-empty value calls `validate(entered)`. Attach the blur handler only when not read-only.
- Dispatch with `changeNblur` when the country code changes, since that is a discrete selection rather than free typing.

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `defaultCountry` | Default country code | `TEXT` | `"US"` |  |
| `allowedCountries` | Allowed countries (comma separated ISO codes) | `TEXT` |  |  |

## Gotchas

- Do not strip the leading `+`. Losing it makes the number ambiguous across regions.
- Do not store the formatted mask (`(555) 123-4567`). Downstream integrations expect E.164.
- `PhoneDisplay` builds the `tel:` href itself — do not construct it manually.
- A required phone field must reject a value that is only a country code with no subscriber digits.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
