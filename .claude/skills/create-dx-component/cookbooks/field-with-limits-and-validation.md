---
title: Customize a field with limits, a counter and validation messages
keywords: [field, text input, updateFieldValue, triggerFieldChange, validatemessage, max length, uppercase, config.json property]
primary_methods: [ActionsApi.updateFieldValue, ActionsApi.triggerFieldChange, PConnect.getStateProps]
related: [build-a-data-widget]
---

# Recipe: Customize a field with limits, a counter and validation messages

> Part of the [Component Authoring cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A text field must limit how many characters can be typed, optionally convert input to uppercase, show a `n/limit` counter, and show the platform's validation message. The limit and the uppercase option must be configurable by the designer.

## Solution

Run every command from the project root. Replace `Acme` and `Lib` with the project's organization and library.

**1. Scaffold the field** (library mode needs `npm run createLib -- Lib 1.0.0 Y Current` once first; see [cli-workflow.md](../references/cli-workflow.md)):

```bash
npm run create -- Field Text CountedText "Counted text" 1.0.0 Lib "Text field with a character counter" Acme
```

**2. Add the designer-facing properties** to `src/components/Acme_Lib_CountedText/config.json`, next to `placeholder`:

```json
{ "name": "maxLength", "label": "Maximum characters", "format": "NUMBER", "defaultValue": 50 },
{ "name": "forceUppercase", "label": "Convert to uppercase", "format": "BOOLEAN", "defaultValue": false }
```

**3. Read the properties in `index.tsx`.** Declare them in the props interface, give them defaults, and normalize them because they can arrive as strings:

```tsx
interface AcmeLibCountedTextProps extends PConnFieldProps {
  // ...scaffolded props (isTableFormatter, formatter, variant)
  maxLength?: number | string;
  forceUppercase?: boolean | string;
}

const { /* ...scaffolded props */ validatemessage, maxLength = 50, forceUppercase = false } = props;

const limit = Number.parseInt(String(maxLength), 10) || 50;
const upper = forceUppercase === true || forceUppercase === 'true';
const normalize = (raw: string) => (upper ? raw.toUpperCase() : raw).slice(0, limit);
```

**4. Write the value through the actions API.** `updateFieldValue` on every change, `triggerFieldChange` on blur:

```tsx
const handleOnChange = (event: any) => {
  actions.updateFieldValue(propName, normalize(event.target.value));
};

const handleOnBlur = (event: any) => {
  actions.triggerFieldChange(propName, normalize(event.target.value));
};
```

`propName` is `pConn.getStateProps().value` (for example `.TextSample`), as in the scaffold. Leave the scaffolded `DISPLAY_ONLY` branch untouched so the field still works in details views and tables.

**5. Render the counter and the validation message** on the editable `Input`:

```tsx
<Input
  type='text'
  value={value}
  label={label}
  labelHidden={hideLabel}
  placeholder={placeholder}
  disabled={disabled}
  readOnly={readOnly}
  required={required}
  onChange={handleOnChange}
  onBlur={handleOnBlur}
  status={validatemessage ? 'error' : undefined}
  info={validatemessage || `${(value ?? '').length}/${limit}`}
  testId={testId}
/>
```

**6. Extend the story and tests.** In `demo.stories.tsx`, forward the blur call to a story-only arg so a test can observe it:

```tsx
triggerFieldChange: (propName: string, theValue: any) => {
  args.onTriggerFieldChange?.(propName, theValue);
}
```

Replace the scaffolded test in `demo.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';

const { BaseAcmeLibCountedText } = composeStories(DemoStories);

const getInput = () => screen.getByTestId('Text-12345678:input:control') as HTMLInputElement;

test('shows the character counter', async () => {
  render(<BaseAcmeLibCountedText maxLength={10} />);
  expect(await screen.findByText('0/10')).toBeVisible();
});

test('truncates to the limit, converts to uppercase and commits on blur', async () => {
  const onTriggerFieldChange = jest.fn();
  // story-only arg: read by the story's fake getActionsApi, not a prop of the component
  const storyArgs: Record<string, unknown> = { onTriggerFieldChange };
  render(<BaseAcmeLibCountedText maxLength={5} forceUppercase {...storyArgs} />);

  fireEvent.change(getInput(), { target: { value: 'hello world' } });
  expect(getInput().value).toBe('HELLO');
  expect(await screen.findByText('5/5')).toBeVisible();

  fireEvent.blur(getInput());
  expect(onTriggerFieldChange).toHaveBeenCalledWith('.TextSample', 'HELLO');
});

test('shows the validation message instead of the counter', async () => {
  render(<BaseAcmeLibCountedText validatemessage='Value is required' />);
  expect(await screen.findByText('Value is required')).toBeVisible();
});

test('renders only the value in DISPLAY_ONLY mode', async () => {
  render(<BaseAcmeLibCountedText displayMode='DISPLAY_ONLY' value='Shown' />);
  expect(await screen.findByText('Shown')).toBeVisible();
  expect(screen.queryByTestId('Text-12345678:input:control')).toBeNull();
});
```

**7. Run the check loop** from [cli-workflow.md](../references/cli-workflow.md):

```bash
npx jest src/components/Acme_Lib_CountedText --coverage=false
npx tsc --noEmit 2>&1 | grep -v "demo.stories.tsx"
npm run validate-schema -- Acme_Lib_CountedText
npm run buildComponent -- Acme_Lib_CountedText N N
```

## Discussion

- **MUST** keep the two-step write: `updateFieldValue` while typing so the store and the screen stay in sync, and `triggerFieldChange` on blur so validation and dependent fields run once the user is done. Calling only `triggerFieldChange` on every keystroke causes extra server round trips; calling only `updateFieldValue` never commits the change. Signatures: [pconnect-actions-api.md](../../references/pconnect-actions-api.md).
- **MUST** normalize the value the same way in both handlers, otherwise the committed value can differ from what the user sees.
- Declare a property in `config.json` **and** in the props interface, and give it a default. A designer can leave it empty and `maxLength` would otherwise be `undefined`.
- Keep the read-only display branches. A field that only renders an input looks broken in details views ([props-contract.md](../references/props-contract.md)).
- Use `fireEvent` from `@testing-library/react` in tests; the template does not install `@testing-library/user-event`.
- Passing `onTriggerFieldChange` through a `Record<string, unknown>` spread keeps `tsc` clean without adding a test-only prop to the component.

## Related recipes

- [Build a data-driven widget with loading, empty and error states](./build-a-data-widget.md)
- [Form and field validation APIs](../../pconnect-forms-and-fields/SKILL.md)
