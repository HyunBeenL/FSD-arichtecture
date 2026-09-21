'use client';

import { useContext } from 'react';
import { ThemeContext } from './ThemeContext.ts';
import type { ThemeContextValue } from './types.ts';

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (value === undefined) {
    throw new Error('useTheme 은 ThemeProvider 안에서만 사용할 수 있습니다.');
  }
  return value;
}
