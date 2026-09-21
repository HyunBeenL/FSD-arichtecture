'use client';

import { createContext } from 'react';
import type { ThemeContextValue } from './types.ts';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
