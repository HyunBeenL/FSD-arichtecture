/* 이 파일은 i18n 세그먼트가 shared/lib 배럴에 여는 것을 모은다 */
export {
  initI18n,
  changeLanguage,
  readStoredLanguage,
  resources,
  LANGUAGE_STORAGE_KEY,
  DEFAULT_LANGUAGE,
  DEFAULT_NAMESPACE,
  NAMESPACES,
} from './config';
export type { SupportedLanguage } from './config';

export { I18nProvider } from './I18nProvider';
export type { I18nProviderProps } from './I18nProvider';
