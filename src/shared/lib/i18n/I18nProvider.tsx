'use client';

/* 이 모듈은 i18next 인스턴스를 만들어 하위 트리에 내려 준다 */
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { initI18n } from './config';

/* I18nProviderProps 는 I18nProvider 가 받는 props 다 */
export interface I18nProviderProps {
  /* I18nProvider 가 i18next 인스턴스를 내려 줄 하위 트리 */
  children: ReactNode;
}

/* I18nProvider 는 app 계층이 트리 맨 위에 두는 컴포넌트다.
   하위 트리의 useTranslation 은 이 컴포넌트가 내려 준 인스턴스를 쓴다 */
export function I18nProvider({ children }: I18nProviderProps) {
  const instance = useMemo(() => initI18n(), []);
  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
