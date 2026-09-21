import type { Brand } from './registry.ts';

export type ColorScheme = 'light' | 'dark' | 'system';

export type ResolvedColorScheme = 'light' | 'dark';

export const COLOR_SCHEMES: readonly ColorScheme[] = ['light', 'dark', 'system'];

export function isColorScheme(value: unknown): value is ColorScheme {
  return typeof value === 'string' && (COLOR_SCHEMES as readonly string[]).includes(value);
}

export interface ThemeContextValue {
  readonly colorSchemePreference: ColorScheme;

  readonly resolvedColorScheme: ResolvedColorScheme;

  readonly brand: Brand;

  setColorScheme(next: ColorScheme): void;
  setBrand(next: Brand): void;

  toggleColorScheme(): void;
}

/**
 * 테마 선택값을 **쿠키**에 둔다. localStorage 가 아니다.
 *
 * 서버가 첫 렌더에 같은 값을 알아야 하기 때문이다. localStorage 는 서버가 못 읽으므로
 * 서버는 기본값으로, 브라우저는 저장값으로 그려 하이드레이션이 어긋난다.
 *
 * 비밀값이 아니므로 httpOnly 가 아니다 — 브라우저 JS 가 써야 한다.
 */
export const THEME_COOKIES = {
  colorScheme: 'ds-color-scheme',
  brand: 'ds-brand',
} as const;

export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
