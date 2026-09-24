/* 이 모듈은 i18next 를 초기화하고, 사용자가 고른 언어를 브라우저의 localStorage 에 보관한다 */
import i18next from 'i18next';
import type { i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import koCommon from '@/locales/ko/common.json';
import koErrors from '@/locales/ko/errors.json';

/* LANGUAGE_STORAGE_KEY 는 브라우저가 고른 언어를 localStorage 에 저장할 때 쓰는 키다 */
export const LANGUAGE_STORAGE_KEY = 'i18n-lang';

/* DEFAULT_LANGUAGE 는 localStorage 에 저장된 언어가 없을 때 i18next 가 쓰는 언어다 */
export const DEFAULT_LANGUAGE = 'ko';

/* DEFAULT_NAMESPACE 는 화면이 네임스페이스를 적지 않고 t() 를 부를 때
   i18next 가 번역을 찾는 네임스페이스다 */
export const DEFAULT_NAMESPACE = 'common';

/* NAMESPACES 는 initI18n 이 i18next 에 등록할 네임스페이스 목록이다 */
export const NAMESPACES = ['common', 'errors'] as const;

/* resources 는 언어별 · 네임스페이스별 번역 문자열을 담는다.
   i18next 는 이 객체에서 번역을 찾는다 */
export const resources = {
  ko: { common: koCommon, errors: koErrors },
};

/* SupportedLanguage 는 resources 가 번역을 갖고 있는 언어다 */
export type SupportedLanguage = keyof typeof resources;

/* readStoredLanguage 는 브라우저가 localStorage 에 저장해 둔 언어를 읽는다.
   Next 서버에는 localStorage 가 없으므로 fallback 을 돌려준다 */
export function readStoredLanguage(fallback: string = DEFAULT_LANGUAGE): string {
  if (typeof window === 'undefined') return fallback;
  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? fallback;
}

/* initialized 는 initI18n 이 i18next 를 이미 초기화했는지 기억한다 */
let initialized = false;

/* initI18n 은 i18next 를 초기화하고 그 인스턴스를 돌려준다.
   호출부가 여러 번 불러도 초기화는 한 번만 한다 */
export function initI18n(): I18nInstance {
  if (initialized) return i18next;

  void i18next.use(initReactI18next).init({
    lng: readStoredLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    ns: [...NAMESPACES],
    defaultNS: DEFAULT_NAMESPACE,
    resources,
    interpolation: { escapeValue: false },
    saveMissing: false,
  });

  initialized = true;
  return i18next;
}

/* changeLanguage 는 i18next 가 쓰는 언어를 바꾸고,
   브라우저의 localStorage 에 그 언어를 저장한다 */
export async function changeLanguage(language: string): Promise<void> {
  await i18next.changeLanguage(language);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
}
