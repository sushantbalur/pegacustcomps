import type { Meta, StoryObj } from '@storybook/react';

import AreteansSushLibAwardPodium from './index';
import { configProps, emptyProps, getPConnect, longNameProps, partialProps } from './mock';

const meta: Meta<typeof AreteansSushLibAwardPodium> = {
  title: 'AreteansSushLibAwardPodium',
  component: AreteansSushLibAwardPodium,
  excludeStories: /.*Data$/,
  argTypes: {
    label: { control: 'text' },
    hideLabel: { control: 'boolean' },
    employeeOfMonth: { control: 'text' },
    starOfWeek: { control: 'text' },
    inspirationOfDay: { control: 'text' },
    getPConnect: { table: { disable: true } }
  }
};

export default meta;
type Story = StoryObj<typeof AreteansSushLibAwardPodium>;

const render: Story['render'] = args => (
  <AreteansSushLibAwardPodium {...args} getPConnect={getPConnect as never} />
);

export const BaseAreteansSushLibAwardPodium: Story = { render, args: configProps };

export const OneNameMissing: Story = { render, args: partialProps };

export const NoNames: Story = { render, args: emptyProps };

export const LongName: Story = { render, args: longNameProps };

export const HiddenLabel: Story = { render, args: { ...configProps, hideLabel: true } };
