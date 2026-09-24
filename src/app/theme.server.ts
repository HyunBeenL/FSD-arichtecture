/* 이 모듈은 Next 서버가 쿠키에서 사용자가 고른 테마를 읽게 한다.
   첫 화면부터 그 테마로 그려 화면이 나온 뒤 색이 바뀌지 않게 한다 */
import { cookies } from 'next/headers';
import {
  defaultBrand,
  isBrand,
  isColorScheme,
  THEME_COOKIES,
  type Brand,
  type ColorScheme,
} from '@/design-system';
import type { InitialTheme } from './providers';

/* DEFAULT_COLOR_SCHEME 은 쿠키가 없을 때 쓰는 테마다. 운영체제 설정을 따른다 */
const DEFAULT_COLOR_SCHEME: ColorScheme = 'system';

/* getInitialTheme 은 쿠키에서 테마와 브랜드를 읽어 AppProviders 에 넘길 값을 만든다.
   쿠키 값이 아는 값이 아니면 기본값을 쓴다 */
export async function getInitialTheme(): Promise<InitialTheme> {
  const store = await cookies();

  const colorScheme = store.get(THEME_COOKIES.colorScheme)?.value;
  const brand = store.get(THEME_COOKIES.brand)?.value;

  return {
    colorScheme: isColorScheme(colorScheme) ? colorScheme : DEFAULT_COLOR_SCHEME,
    brand: isBrand(brand) ? (brand as Brand) : defaultBrand,
  };
}
