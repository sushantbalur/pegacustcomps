---
title: Show a property as a colored status badge (display-only Field)
keywords: [status, badge, pill, display-only, DISPLAY_ONLY, Status, variant, Field, Text, statusMap, read-only value]
primary_methods: [getStateProps, Status]
related: [field-with-limits-and-validation, build-a-data-widget]
---

# Recipe: Show a property as a colored status badge

> Part of the [Component Authoring cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A case property holds a short status such as `Approved` or `Rejected`. In a details view or a table the user wants to see it as a colored badge, and the app designer should choose which value gets which color in App Studio. The same Field should still work as a normal text input when the view is editable.

## Solution

A read-only badge bound to a property is a **Field** (subtype `Text`) that handles `DISPLAY_ONLY`; it is not a Presentation component, and it is a Widget only if it loads its own data. See [choosing-type-and-subtype.md](../references/choosing-type-and-subtype.md).

**1. Scaffold a Text field:**

`npm run create -- Field Text StatusBadge "Status badge" 1.0.0 Lib "Shows a status as a colored badge" Acme`

**2. Add one authoring property to `config.json`**, after the existing ones. The designer types value and color pairs:

| Property | Label | Format | Notes |
| --- | --- | --- | --- |
| `statusMap` | Status colors | `TEXT` | helper text: "Value=color pairs, comma separated. Colors: success, urgent, warn, pending, info." |

**3. Edit `index.tsx`.** Import `Status` from `@pega/cosmos-react-core` and add `statusMap?: string` to the props interface. Add two small, exported pure functions above the component:

```typescript
type StatusVariant = 'success' | 'urgent' | 'warn' | 'pending' | 'info';
const STATUS_VARIANTS: StatusVariant[] = ['success', 'urgent', 'warn', 'pending', 'info'];

// "Approved=success, Rejected=urgent" -> { approved: 'success', rejected: 'urgent' }
export const parseStatusMap = (text = ''): Record<string, StatusVariant> =>
  text.split(',').reduce<Record<string, StatusVariant>>((map, pair) => {
    const [key, variant] = pair.split('=').map(part => part.trim());
    if (key && STATUS_VARIANTS.includes(variant as StatusVariant)) map[key.toLowerCase()] = variant as StatusVariant;
    return map;
  }, {});

// An unmapped or misspelled value gets the neutral 'info' variant instead of failing.
export const variantFor = (value: string, statusMap?: string): StatusVariant =>
  parseStatusMap(statusMap)[String(value).trim().toLowerCase()] ?? 'info';
```

Then replace only the `DISPLAY_ONLY` branch's value rendering, keeping the scaffold's empty placeholder:

```typescript
let displayComp: any = value ? (
  <Status variant={variantFor(value, statusMap)}>{value}</Status>
) : (
  <span aria-hidden='true'>&ndash;&ndash;</span>
);
```

Leave the editable `Input` as the scaffold has it. Remove the unused `variant?: any` from the props interface, because the dead-code rule and ESLint reject it.

**4. Add tests** to `demo.test.tsx`. The pure functions are the part worth testing precisely:

```typescript
test('maps values to variants, ignoring case and bad entries', () => {
  const map = 'Approved=success, Rejected = urgent, Bad=purple, =warn, Pending=pending';
  expect(variantFor('approved', map)).toBe('success');
  expect(variantFor(' Rejected ', map)).toBe('urgent');
  expect(variantFor('Pending', map)).toBe('pending');
});

test('falls back to info for an unmapped value, a bad variant or no map', () => {
  expect(variantFor('Unknown', 'Approved=success')).toBe('info');
  expect(variantFor('Bad', 'Bad=purple')).toBe('info');
  expect(variantFor('Approved')).toBe('info');
});
```

Add a test that renders the component with `displayMode: 'DISPLAY_ONLY'` and a mapped value and checks the text is shown, and another with an empty value that checks the placeholder dash. Render the component directly with a small `getPConnect` that returns `getStateProps` and `getActionsApi`; see [test-pattern.md](../references/test-pattern.md).

**5. Add a display-only story** in `demo.stories.tsx` (value `Approved`, `statusMap` set, `displayMode: 'DISPLAY_ONLY'`) so the badge can be reviewed in Storybook. The check script warns when there is only one story.

**6. Run** `node .claude/skills/validate-component/scripts/check-component.mjs Acme_Lib_StatusBadge`.

This recipe was built in a generated project: the schema check, `tsc`, ESLint and Jest all passed (the build step was not run there).

## Discussion

- **Why a map property and not hard-coded colors.** Statuses differ between applications. Putting the pairs in `config.json` lets the designer change them without a code change, and an unmapped value still renders, as the neutral `info` badge.
- **`Status` takes five variants only**: `success`, `urgent`, `warn`, `pending` and `info`. The label is a string or number, and Cosmos transforms it to uppercase. Check the installed `Status.d.ts` before using another prop.
- **Color is never the only signal.** The badge text carries the status, so a user who cannot distinguish the colors still reads it.
- **Localization.** The badge shows the stored value as it is. If the values need translating, pass the text through `getLocalizedText` and add each possible value to `localizations.json`; see [localization.md](../references/localization.md).
- **Editable mode** is the unchanged scaffold. If users must also edit the status, make it a picklist instead (see the `picklist` skill) so the value cannot be mistyped.

## Related recipes

- [Customize a field with limits, a counter and validation messages](./field-with-limits-and-validation.md)
- [Build a data-driven widget](./build-a-data-widget.md)
