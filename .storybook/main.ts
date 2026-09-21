import type { StorybookConfig } from '@storybook/nextjs';

/**
 * Storybook 설정.
 *
 * ⚠️ Vite → Next 이전 때 빌더를 `@storybook/react-vite` 에서 `@storybook/nextjs` 로
 *    바꿨다. Vite 를 제거했으므로 이전 빌더는 동작하지 않는다.
 *    path alias(`@/*`)와 CSS Modules 는 Next 빌더가 tsconfig 에서 읽어 그대로 쓴다 —
 *    `viteFinal` 로 손수 맞추던 부분이 사라졌다.
 *
 * ⚠️ autodocs 는 Storybook 9 부터 `docs.autodocs` 설정이 아니라 스토리의
 *    `tags: ['autodocs']` 로 켠다. 렌더는 `@storybook/addon-docs` 가 맡으므로
 *    이 addon 이 빠지면 Docs 탭이 빈 화면이 된다.
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
};

export default config;
