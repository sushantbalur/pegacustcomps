import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // react-docgen 8 calls Babel's loadPartialConfig synchronously, which Babel 8 no longer allows.
  // The crash blanks every story, so docgen is off; stories declare their controls in argTypes.
  typescript: {
    reactDocgen: false,
  },
};
export default config;
