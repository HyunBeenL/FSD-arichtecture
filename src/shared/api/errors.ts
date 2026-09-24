/* 이 모듈은 실패를 ApiError 로 표현하고, 화면이 상태 코드 대신 kind 로 판단하게 한다 */
/* ErrorKind 는 화면이 실패를 판단할 때 쓰는 분류다.
   network 와 timeout 은 대응하는 HTTP 상태 코드가 없다 */
export type ErrorKind =
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'validation'
  | 'conflict'
  | 'network'
  | 'timeout'
  | 'unknown';

/* ApiErrorOptions 는 ApiError 를 만들 때 함께 담는 부가 정보다 */
export interface ApiErrorOptions {
  /* 서버가 준 HTTP 상태 코드. 응답이 없으면 비어 있다 */
  status?: number;
  /* 이 에러를 만들게 한 원래 에러 */
  cause?: unknown;
  /* 서버가 준 필드별 검증 메시지 */
  fieldErrors?: Record<string, string[]>;
  /* 로그에 남길 추가 정보 */
  context?: Record<string, unknown>;
}

/* ApiError 는 이 앱이 다루는 모든 실패의 표현이다.
   apiClient 가 axios 에러를 이 형태로 바꿔 던진다 */
export class ApiError extends Error {
  readonly kind: ErrorKind;
  readonly status?: number;
  readonly fieldErrors: Record<string, string[]>;
  readonly context?: Record<string, unknown>;

  constructor(kind: ErrorKind, message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = 'ApiError';
    this.kind = kind;
    this.status = options.status;
    this.fieldErrors = options.fieldErrors ?? {};
    this.context = options.context;
  }
}

/* isApiError 는 받은 값이 ApiError 인지 판별한다 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/* isErrorKind 는 받은 값이 ApiError 이면서 그 kind 가 일치하는지 판별한다.
   화면은 상태 코드 대신 이 함수로 분기한다 */
export function isErrorKind(error: unknown, kind: ErrorKind): error is ApiError {
  return isApiError(error) && error.kind === kind;
}

/* toApiError 는 무엇이 던져졌든 ApiError 로 바꿔 돌려준다 */
export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;
  if (error instanceof Error) {
    return new ApiError('unknown', error.message, { cause: error });
  }
  return new ApiError('unknown', String(error));
}

/* kindFromStatus 는 HTTP 상태 코드를 ErrorKind 로 옮긴다 */
export function kindFromStatus(status: number): ErrorKind {
  switch (status) {
    case 401:
      return 'unauthorized';
    case 403:
      return 'forbidden';
    case 404:
      return 'notFound';
    case 409:
      return 'conflict';
    case 400:
    case 422:
      return 'validation';
    default:
      return 'unknown';
  }
}

/* parseFieldErrors 는 응답 본문에서 필드별 검증 메시지를 꺼낸다.
   모양이 다르면 빈 객체를 돌려준다 */
export function parseFieldErrors(body: unknown): Record<string, string[]> {
  if (body === null || typeof body !== 'object' || !('fieldErrors' in body)) return {};

  const raw = (body as { fieldErrors: unknown }).fieldErrors;
  if (raw === null || typeof raw !== 'object') return {};

  return Object.fromEntries(
    Object.entries(raw as Record<string, unknown>).filter(
      (entry): entry is [string, string[]] =>
        Array.isArray(entry[1]) && entry[1].every((s) => typeof s === 'string'),
    ),
  );
}

/* errorMessageKey 는 실패를 i18n 키로 바꾼다.
   백엔드 메시지를 화면에 그대로 내보내지 않기 위해 이 함수를 거친다 */
export function errorMessageKey(error: unknown): string {
  return `errors:${isApiError(error) ? error.kind : 'unknown'}`;
}
