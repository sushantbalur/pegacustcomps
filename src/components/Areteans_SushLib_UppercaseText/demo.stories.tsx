import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { stateProps, configProps } from './mock';

import AreteansSushLibUppercaseText from './index';

const meta: Meta<typeof AreteansSushLibUppercaseText> = {
  title: 'AreteansSushLibUppercaseText',
  component: AreteansSushLibUppercaseText,
  excludeStories: /.*Data$/,
  argTypes: {
    label: { control: 'text' },
    hideLabel: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    placeholder: { control: 'text' },
    maxLength: { control: 'number' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    helperText: { control: 'text' },
    validatemessage: { control: 'text' },
    testId: { control: 'text' },
    displayMode: { control: 'select', options: ['', 'DISPLAY_ONLY'] },
    getPConnect: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof AreteansSushLibUppercaseText>;

const renderField = (args: any) => {
  const [value, setValue] = useState(args.value ?? configProps.value);

  const props = {
    value,
    getPConnect: () =>
      ({
        getStateProps: () => stateProps,
        getActionsApi: () => ({
          updateFieldValue: (_propName: string, theValue: string) => {
            setValue(theValue);
          },
          triggerFieldChange: (propName: string, theValue: string) => {
            args.onTriggerFieldChange?.(propName, theValue);
          },
        }),
        clearErrorMessages: () => {
          /* nothing */
        },
        getValidationApi: () => ({
          validate: (theValue: string) => {
            args.onValidate?.(theValue);
          },
        }),
      }) as any,
  };

  return <AreteansSushLibUppercaseText {...args} {...props} />;
};

const baseArgs = {
  label: configProps.label,
  hideLabel: configProps.hideLabel,
  readOnly: configProps.readOnly,
  placeholder: configProps.placeholder,
  maxLength: configProps.maxLength,
  required: configProps.required,
  disabled: configProps.disabled,
  helperText: configProps.helperText,
  validatemessage: configProps.validatemessage,
  testId: configProps.testId,
  displayMode: configProps.displayMode,
};

export const BaseAreteansSushLibUppercaseText: Story = {
  render: renderField,
  args: baseArgs,
};

export const Populated: Story = { render: renderField, args: { ...baseArgs, value: 'ABC123' } };
export const Required: Story = { render: renderField, args: { ...baseArgs, required: true } };
export const ValidationError: Story = {
  render: renderField,
  args: { ...baseArgs, required: true, validatemessage: 'Cannot be blank' },
};
export const ReadOnly: Story = { render: renderField, args: { ...baseArgs, readOnly: true, value: 'ABC123' } };
export const Disabled: Story = { render: renderField, args: { ...baseArgs, disabled: true, value: 'ABC123' } };
export const DisplayOnly: Story = {
  render: renderField,
  args: { ...baseArgs, displayMode: 'DISPLAY_ONLY', value: 'ABC123' },
};
export const DisplayOnlyEmpty: Story = { render: renderField, args: { ...baseArgs, displayMode: 'DISPLAY_ONLY' } };
