/* 이 파일은 shared/api 가 바깥에 여는 공개 표면이다.
   Next 서버 전용은 여기 없다. server.ts 가 따로 연다 */
export { apiClient, configureApiClient } from './api-client';
export type { ApiClientConfig, RequestOptions, QueryValue } from './api-client';

export {
  ApiError,
  isApiError,
  isErrorKind,
  toApiError,
  kindFromStatus,
  parseFieldErrors,
  errorMessageKey,
} from './errors';
export type { ErrorKind, ApiErrorOptions } from './errors';
