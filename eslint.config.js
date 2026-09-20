import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const BOUNDARY_SEVERITY = 'error';

function layerRule(name, files, forbidden) {
  return {
    name: 'fsd/' + name,
    files,
    rules: {
      'no-restricted-imports': [BOUNDARY_SEVERITY, { patterns: forbidden }],
    },
  };
}

const UPPER = {
  app: ['@/app', '@/app/*'],
  views: ['@/views/*'],
  widgets: ['@/widgets/*'],
  features: ['@/features/*'],
  entities: ['@/entities/*'],
};

const DEEP = [
  '@/entities/*/*',
  '@/features/*/*',
  '@/widgets/*/*',
  '@/views/*/*',
  '@/design-system/*',
  '@/shared/*/*',
  '@/app/*',

  '!@/entities/*/server',
  '!@/features/*/server',
  '!@/widgets/*/server',
  '!@/views/*/server',
  '!@/shared/*/server',
  '!@/app/server',

  '!@/app/api-routes',
];

const upward = (layers) => ({
  group: layers.flat(),
  message:
    'FSD: 위 계층을 참조할 수 없습니다. app → views → widgets → features → entities → shared 한 방향입니다.',
});

const deepImport = {
  group: DEEP,
  message:
    'FSD: 슬라이스의 공개 API(index.ts)만 import 하세요. 예) @/entities/post, @/design-system',
};

const crossSlice = (own) => ({
  group: [own].flat(),
  message:
    'FSD: 같은 계층의 다른 슬라이스는 참조할 수 없습니다. 둘을 합쳐야 하면 위 계층(widgets·views)에서 조립하세요.',
});

export const boundaryConfigs = [
  layerRule(
    'design-system',
    ['src/design-system/**/*.{ts,tsx}'],
    [
      {
        group: [
          'next',
          'next/*',
          'axios',
          '@tanstack/*',
          'react-hook-form',
          'i18next',
          'react-i18next',
          'zustand',
          'zod',
          '@/shared/*',
          '@/entities/*',
          '@/features/*',
          '@/widgets/*',
          '@/views/*',
          '@/app/*',
          '@/*',
          '!@/design-system',
        ],
        message:
          'design-system 은 앱 코드와 데이터·라우팅 라이브러리를 모릅니다. 필요하면 prop 으로 주입받으세요.',
      },
    ],
  ),

  layerRule(
    'shared',
    ['src/shared/**/*.{ts,tsx}'],
    [upward([UPPER.entities, UPPER.features, UPPER.widgets, UPPER.views, UPPER.app]), deepImport],
  ),

  layerRule(
    'entities',
    ['src/entities/**/*.{ts,tsx}'],
    [
      upward([UPPER.features, UPPER.widgets, UPPER.views, UPPER.app]),
      crossSlice(UPPER.entities),
      deepImport,
    ],
  ),

  layerRule(
    'features',
    ['src/features/**/*.{ts,tsx}'],
    [upward([UPPER.widgets, UPPER.views, UPPER.app]), crossSlice(UPPER.features), deepImport],
  ),

  layerRule(
    'widgets',
    ['src/widgets/**/*.{ts,tsx}'],
    [upward([UPPER.views, UPPER.app]), crossSlice(UPPER.widgets), deepImport],
  ),

  layerRule(
    'views',
    ['src/views/**/*.{ts,tsx}'],
    [upward([UPPER.app]), crossSlice(UPPER.views), deepImport],
  ),

  layerRule('app', ['src/app/**/*.{ts,tsx}', 'src/main.tsx'], [deepImport]),
];

export default tseslint.config(
  {
    ignores: ['.next', 'dist', 'storybook-static', 'coverage', 'node_modules', '.npm-cache'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
  },
  {
    files: ['*.config.{ts,js}', 'scripts/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },

  prettierConfig,

  ...boundaryConfigs,
);
