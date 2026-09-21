'use client';

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { ThemeContext } from './ThemeContext.ts';
import { type Brand, defaultBrand } from './registry.ts';
import {
  type ColorScheme,
  type ResolvedColorScheme,
  type ThemeContextValue,
  THEME_COOKIES,
  THEME_COOKIE_MAX_AGE,
} from './types.ts';

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultColorScheme?: ColorScheme;
  defaultBrand?: Brand;
  disablePersistence?: boolean;
  targetElement?: HTMLElement;
}

const canUseDOM = typeof window !== 'undefined' && typeof window.matchMedia === 'function';

const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * ⚠️ **저장값을 읽어서 초기 상태로 쓰지 않는다.**
 *
 * 서버는 저장소를 못 읽으므로 기본값으로 그리고, 브라우저가 저장값으로 그리면
 * 같은 버튼이 서버에선 `variantPrimary`, 클라이언트에선 `variantGhost` 가 되어
 * 하이드레이션이 어긋난다. 실제로 그 에러가 났었다.
 *
 * 그래서 초기값은 **prop 으로만** 받는다. 서버가 쿠키를 읽어 넣어 준다
 * (`app/layout.tsx` → `AppProviders` → 여기). 저장은 아래 effect 가 한다.
 */
function writeThemeCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
}

function resolve(preference: ColorScheme, systemPrefersDark: boolean): ResolvedColorScheme {
  if (preference === 'system') return systemPrefersDark ? 'dark' : 'light';
  return preference;
}

/**
 * OS 선호 구독 — `useSyncExternalStore` 를 쓰는 이유.
 *
 * ⚠️ 서버는 이 값을 **원리적으로 알 수 없다.** `useState` 초기값으로 `matchMedia` 를
 *    읽으면 서버는 false, 브라우저는 true 가 되어 하이드레이션이 어긋난다.
 *
 * `useSyncExternalStore` 는 **서버 스냅샷을 따로 받는다.** 하이드레이션 동안에는
 * 서버 값(false)을 쓰고, 끝난 뒤 클라이언트 값으로 다시 그린다. React 가 그 전환을
 * 보장하므로 불일치가 아니다.
 *
 * ⚠️ 그래도 이 값을 **화면에 직접 쓰면 안 된다.** 첫 프레임이 항상 라이트 기준이 되기
 *    때문이다. 보이는 것은 `colorSchemePreference`(쿠키에서 옴)로 판단하고,
 *    OS 선호에 따른 실제 색은 CSS 의 `prefers-color-scheme` 가 정한다.
 */
function subscribeSystemDark(onChange: () => void): () => void {
  if (!canUseDOM) return () => {};
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getSystemDark(): boolean {
  return canUseDOM ? window.matchMedia(DARK_QUERY).matches : false;
}

function getSystemDarkOnServer(): boolean {
  return false;
}

export function ThemeProvider({
  children,
  defaultColorScheme = 'system',
  defaultBrand: brandFallback = defaultBrand,
  disablePersistence = false,
  targetElement,
}: ThemeProviderProps) {
  const [colorSchemePreference, setColorSchemeState] = useState<ColorScheme>(defaultColorScheme);
  const [brand, setBrandState] = useState<Brand>(brandFallback);

  const systemPrefersDark = useSyncExternalStore(
    subscribeSystemDark,
    getSystemDark,
    getSystemDarkOnServer,
  );

  const resolvedColorScheme = resolve(colorSchemePreference, systemPrefersDark);

  /**
   * ⚠️ `'system'` 일 때는 **`data-theme` 을 찍지 않고 지운다.**
   *    OS 선호는 CSS 의 `prefers-color-scheme` 가 판정한다 (`themes/dark.css`).
   *    JS 가 해석해서 찍으면 첫 페인트가 항상 라이트로 나갔다가 튄다.
   */
  useEffect(() => {
    if (!canUseDOM) return;
    const target = targetElement ?? document.documentElement;
    if (colorSchemePreference === 'system') target.removeAttribute('data-theme');
    else target.setAttribute('data-theme', colorSchemePreference);
    target.setAttribute('data-brand', brand);
  }, [colorSchemePreference, brand, targetElement]);

  useEffect(() => {
    if (!canUseDOM || disablePersistence) return;
    writeThemeCookie(THEME_COOKIES.colorScheme, colorSchemePreference);
    writeThemeCookie(THEME_COOKIES.brand, brand);
  }, [colorSchemePreference, brand, disablePersistence]);

  const setColorScheme = useCallback((next: ColorScheme) => {
    setColorSchemeState(next);
  }, []);

  const setBrand = useCallback((next: Brand) => {
    setBrandState(next);
  }, []);

  const toggleColorScheme = useCallback(() => {
    setColorSchemeState((prev) => {
      const current = resolve(prev, systemPrefersDark);
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [systemPrefersDark]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorSchemePreference,
      resolvedColorScheme,
      brand,
      setColorScheme,
      setBrand,
      toggleColorScheme,
    }),
    [
      colorSchemePreference,
      resolvedColorScheme,
      brand,
      setColorScheme,
      setBrand,
      toggleColorScheme,
    ],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
