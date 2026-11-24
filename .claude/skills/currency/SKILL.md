---
name: currency
description: 'Scaffold a Pega DX Field component with subtype **Currency** — monetary amount input bound to a decimal case property. Use when: user asks for a money input, price, amount, cost, budget field, or a formatted currency display.'
argument-hint: 'Describe the currency field (e.g., "an invoice amount in EUR with two decimals")'
---

# Create Currency Field

Field subtype `Currency`. Binds to a decimal case property holding a monetary amount.

Read [../field/SKILL.md](../field/SKILL.md) for the shared Field rules first. This skill adds only what is specific to `Currency`.

## Cosmos Mapping

| Mode | Component |
| --- | --- |
| Edit | `CurrencyInput` from `@pega/cosmos-react-core` |
| `DISPLAY_ONLY` | `CurrencyDisplay` |

## Value Handling

- Store the **numeric amount only**. The currency code lives in its own property or in `config.json`, never concatenated into the value.
- Never store the formatted string (`"$1,234.56"`). Store `1234.56`.
- Take the currency from an authored property (production Fields call it `currencyISOCode`, so prefer that name over `currencyCode`). When it is empty fall back to `PCore.getFieldDefaultUtils().fieldDefaults.Currency.currencyISOCode`, then `'USD'`. Never hard-code a symbol; pass the ISO code to `CurrencyInput` / `CurrencyDisplay`.
- Validate the code before use with `new Intl.NumberFormat('en', { style: 'currency', currency: code })` in a try/catch; an invalid code throws.
- The stored value can be `null`; read it as `valueProp ?? ''`. When the input is cleared dispatch `''` (what the platform's numeric fields send), so the property clears instead of becoming `0`. Never test with `if (!value)`; `0` is a valid amount.
- Commit on blur with `changeNblur`, comparing the parsed entry with the stored value as strings, and call `validate(entered)` only when nothing changed. See [field-behavior.md](../create-dx-component/references/field-behavior.md).

## config.json Additions

| Property | Label | Format | Default | Notes |
| --- | --- | --- | --- | --- |
| `currencyCode` | Currency code | `TEXT` | `"USD"` |  |
| `decimalPrecision` | Decimal places | `NUMBER` | `2` |  |
| `allowNegative` | Allow negative amounts | `BOOLEAN` | `false` |  |

## Gotchas

- **Do not use floating-point arithmetic on money.** If the component sums or compares amounts, work in minor units (integer cents) and convert once at the edge.
- Rounding must be explicit. `toFixed` rounds half-away-from-zero, which may not match the financial rule the business expects — confirm before relying on it.
- A currency symbol is not a currency code. `$` is ambiguous across USD, CAD, AUD; store the ISO code.
- Respect `decimalPrecision` for zero-decimal currencies such as JPY, where a hard-coded `2` is wrong.

## Validate

Run `node .claude/skills/validate-component/scripts/check-component.mjs <Org>_<Library>_<Name>` and paste its table into your final report.
