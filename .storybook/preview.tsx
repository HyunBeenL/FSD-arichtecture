import type { Preview } from '@storybook/nextjs';
import React from 'react';
import { ThemeProvider } from '../src/design-system/theme/ThemeProvider';
import type { ColorScheme } from '../src/design-system/theme/types';
import type { Brand } from '../src/design-system/theme/registry';
import '../src/index.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: '컬러 테마',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'sun',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    brand: {
      description: '브랜드',
      defaultValue: 'default',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'violet', title: 'Violet' },
          { value: 'teal', title: 'Teal' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const colorScheme = context.globals.theme as ColorScheme;
      const brand = context.globals.brand as Brand;
      return (
        <ThemeProvider defaultColorScheme={colorScheme} defaultBrand={brand} disablePersistence>
          <div style={{ padding: '1rem' }}>
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
