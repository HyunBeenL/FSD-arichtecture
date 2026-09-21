export { ThemeProvider, type ThemeProviderProps } from './ThemeProvider.tsx';
export { useTheme } from './useTheme.ts';
export { ThemeContext } from './ThemeContext.ts';
export {
  brands,
  defineBrands,
  defaultBrand,
  isBrand,
  type Brand,
  type BrandDefinition,
} from './registry.ts';
export {
  COLOR_SCHEMES,
  isColorScheme,
  THEME_COOKIES,
  THEME_COOKIE_MAX_AGE,
  type ColorScheme,
  type ResolvedColorScheme,
  type ThemeContextValue,
} from './types.ts';
