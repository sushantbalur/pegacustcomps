# Storybook Pattern

## Standard Storybook File (demo.stories.tsx)

```typescript
/* eslint-disable react/jsx-no-useless-fragment */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { configProps, stateProps } from './mock';
import AcmeLibComponentName from './index';

const meta: Meta<typeof AcmeLibComponentName> = {
  title: 'AcmeLibComponentName',
  component: AcmeLibComponentName,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof AcmeLibComponentName>;

export const BaseAcmeLibComponentName: Story = (args: any) => {
  const [value, setValue] = useState(configProps.value);

  const props = {
    value,
    additionalProps: configProps.additionalProps || {},
    getPConnect: () => {
      return {
        getStateProps: () => {
          return stateProps;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: (propName: string, theValue: any) => {
              setValue(theValue);
            },
            triggerFieldChange: () => { /* nothing */ }
          };
        },
        getValidationApi: () => {
          return {
            validate: () => { /* nothing */ }
          };
        },
        getInheritedProps: () => {
          return {};
        },
        getContextName: () => {
          return 'app/primary_1';
        },
        getLocalizationService: () => {
          return {
            getLocalizedText: (val: any) => val
          };
        },
        getValue: (val: any) => val,
        ignoreSuggestion: () => { /* nothing */ },
        acceptSuggestion: () => { /* nothing */ },
        setInheritedProps: () => { /* nothing */ },
        resolveConfigProps: () => { /* nothing */ }
      };
    }
  };

  return (
    <>
      <AcmeLibComponentName {...props} {...args} />
    </>
  );
};

BaseAcmeLibComponentName.args = {
  label: configProps.label,
  helperText: configProps.helperText,
  testId: configProps.testId,
  readOnly: configProps.readOnly,
  disabled: configProps.disabled,
  required: configProps.required,
  hideLabel: configProps.hideLabel,
  displayMode: configProps.displayMode,
  validatemessage: configProps.validatemessage
};
```

## Controls (argTypes)

Give the story meta `argTypes` so the Storybook controls panel is usable. Every authoring property in `config.json` (except platform-handled formats such as `VISIBILITY`, and `GROUP` wrappers) gets an entry; `check-component.mjs` warns about any that are missing.

| `config.json` format | `argTypes` entry |
| --- | --- |
| `TEXT` | `{ control: 'text' }` |
| `BOOLEAN` | `{ control: 'boolean' }` |
| `NUMBER` | `{ control: { type: 'number', min, max, step } }`, copying `min` and `max` from `config.json` |
| `SELECT` | `{ options: [keys], control: { type: 'select', labels: { key: 'value' } } }`, built from `source` |
| `DATASOURCE`, objects, `getPConnect` | `{ table: { disable: true } }` |

- A prop with a fixed set of values (`mode`, `wheelType`, `variant`) gets a `select` control with `options` and human-readable `labels`, never a free-text box.
- Seed the base story's `args` from `mock.ts` `configProps`, whose values match the `config.json` defaults, so the panel opens on the authored defaults.
- List the component's own props first, then common DX props such as `testId` and `hideLabel`.
- Set explicit defaults in the story `args` for common DX props (`hideLabel: false`, `testId: ''`) and expose `hideLabel` as one boolean control.
- Hide what cannot be edited in the panel (`getPConnect`, object props such as `datasource`) with `table: { disable: true }`.

```typescript
const meta: Meta<typeof AcmeLibMyWidget> = {
  title: 'AcmeLibMyWidget',
  component: AcmeLibMyWidget,
  excludeStories: /.*Data$/,
  argTypes: {
    mode: {
      options: ['game', 'business'],
      control: { type: 'select', labels: { game: 'Game (place bets)', business: 'Business (pick an item)' } }
    },
    hideLabel: { control: 'boolean' },
    getPConnect: { table: { disable: true } }
  }
};
```

## Widget Storybook Pattern (with PCore mocking)

For widgets that use `PCore` global APIs:

```typescript
/* eslint-disable react/jsx-no-useless-fragment */
import type { Meta, StoryObj } from '@storybook/react';
import AcmeLibMyWidget from './index';
import mockData from './mock';

const meta: Meta<typeof AcmeLibMyWidget> = {
  title: 'AcmeLibMyWidget',
  component: AcmeLibMyWidget,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof AcmeLibMyWidget>;

if (!window.PCore) {
  window.PCore = {} as any;
}

export const BaseAcmeLibMyWidget: Story = (args: any) => {
  window.PCore.getConstants = () => {
    return { CASE_INFO: { CASE_INFO_ID: 'caseInfo.ID' } } as any;
  };

  window.PCore.getLocaleUtils = () => {
    return { getLocaleValue: (value: any) => value } as any;
  };

  window.PCore.getDataApiUtils = () => {
    return {
      getData: () => new Promise(resolve => resolve(mockData))
    } as any;
  };

  const props = {
    getPConnect: () => {
      return {
        getValue: (value: any) => value,
        getContextName: () => 'app/primary_1',
        getLocalizationService: () => ({
          getLocalizedText: (value: any) => value
        }),
        getActionsApi: () => ({
          updateFieldValue: () => {},
          triggerFieldChange: () => {}
        }),
        ignoreSuggestion: () => {},
        acceptSuggestion: () => {},
        setInheritedProps: () => {},
        resolveConfigProps: () => {}
      };
    }
  };

  return (
    <>
      <AcmeLibMyWidget {...props} {...args} />
    </>
  );
};

BaseAcmeLibMyWidget.args = {
  label: 'Widget Title'
};
```

## Template Storybook Pattern

For templates with children:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import AcmeLibMyTemplate from './index';
import { configProps } from './mock';

const meta: Meta<typeof AcmeLibMyTemplate> = {
  title: 'AcmeLibMyTemplate',
  component: AcmeLibMyTemplate,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof AcmeLibMyTemplate>;

export const BaseAcmeLibMyTemplate: Story = (args: any) => {
  const props = {
    ...configProps,
    children: [
      <div key="1">Child 1</div>,
      <div key="2">Child 2</div>
    ],
    getPConnect: () => ({
      getInheritedProps: () => ({}),
      getActionsApi: () => ({
        updateFieldValue: () => {},
        triggerFieldChange: () => {}
      }),
      getValidationApi: () => ({ validate: () => {} })
    })
  };

  return <AcmeLibMyTemplate {...props} {...args} />;
};

BaseAcmeLibMyTemplate.args = {
  label: 'Template Label',
  showLabel: true,
  NumCols: '2'
};
```

## `mock.ts` rules


Export the sample props the story needs, at minimum `configProps` and, for components bound to a property, `stateProps` (scaffolds often export more, such as sample data or metadata):

```typescript
export const configProps = {
  label: 'Spin Wheel',
  names: 'Alice, Bob, Carol, Dan, Eve',
  spinDuration: 800
};

export const stateProps = {
  value: '.Names'
};
```

- `configProps` keys mirror `config.json` property names, with fully resolved values — never the `@L` prefix.
- `stateProps.value` is the dot-notation case property path the component binds to.
- Widget fixtures must be realistic enough that the story renders without a live Pega server.

## Story conventions


- Name the base story `Base<InnerFunctionName>` — `demo.test.tsx` imports it by that name through `composeStories`.
- If the return is wrapped in a fragment, start the file with `/* eslint-disable react/jsx-no-useless-fragment */`.
- Empty mock callbacks need a `/* nothing */` comment body to satisfy lint.
- Story and mock files are excluded from the main ESLint config, but keep them consistent with the rest of the repo anyway.
