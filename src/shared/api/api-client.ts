/* 이 모듈은 앱의 모든 HTTP 요청을 보내고, 401 응답에는 토큰을 재발급하며,
   실패를 ApiError 로 변환한다 */
import axios, { AxiosError } from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiError, kindFromStatus, parseFieldErrors, toApiError } from './errors';

/* BASE_URL 은 axios 가 요청을 보낼 기본 주소다.
   브라우저는 상대 경로를 쓰고, Next 서버는 절대 URL 을 쓴다 */
const BASE_URL =
  typeof window === 'undefined'
    ? (process.env.API_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}/api`)
    : (process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api');

/* DEFAULT_TIMEOUT_MS 는 axios 가 응답을 기다리는 기본 시간이다 */
const DEFAULT_TIMEOUT_MS = 10_000;

declare module 'axios' {
  export interface AxiosRequestConfig {
    /* 이 값이 true 면 인터셉터는 이 요청의 401 응답에 토큰 재발급을 시도하지 않는다 */
    skipAuthRefresh?: boolean;
    /* 인터셉터가 이 요청을 재발급 후 재시도했음을 이 값에 표시한다 */
    _retried?: boolean;
  }
}

/* QueryValue 는 쿼리 파라미터 하나가 가질 수 있는 값의 타입이다 */
export type QueryValue = string | number | boolean | null | undefined | Array<string | number>;

/* RequestOptions 는 apiClient 의 각 함수가 마지막 인자로 받는 요청 설정이다 */
export interface RequestOptions {
  /* axios 가 URL 뒤에 붙일 쿼리 파라미터 */
  query?: Record<string, QueryValue>;
  /* axios 가 요청에 실을 추가 헤더. SSR 은 인증 토큰을 여기에 넣는다 */
  headers?: Record<string, string>;
  /* 호출부가 이 요청을 취소할 때 쓰는 신호 */
  signal?: AbortSignal;
  /* 이 요청 하나에만 적용할 제한 시간 */
  timeoutMs?: number;
  /* true 면 인터셉터는 이 요청의 401 응답에 토큰 재발급을 시도하지 않는다 */
  skipAuthRefresh?: boolean;
}

/* ApiClientConfig 는 app 계층이 이 모듈에 주입하는 설정이다 */
export interface ApiClientConfig {
  /* 인터셉터가 401 을 만났을 때 호출할 함수.
     토큰 재발급에 성공하면 true 를 반환한다 */
  onUnauthorized?: () => Promise<boolean>;
}

/* app 계층이 주입한 설정을 이 모듈이 보관한다 */
let apiClientConfig: ApiClientConfig = {};

/* configureApiClient 는 app 계층이 넘긴 설정을 이 모듈에 저장한다 */
export function configureApiClient(next: ApiClientConfig): void {
  apiClientConfig = next;
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  /* 인증 토큰이 HttpOnly 쿠키이므로, axios 가 요청마다 쿠키를 함께 보내게 한다 */
  withCredentials: true,
});

/* axios 가 배열 쿼리를 tag=a&tag=b 로 직렬화하게 한다 (기본값은 tag[0]=a) */
axiosInstance.defaults.paramsSerializer = {
  indexes: null,
};

/* 진행 중인 토큰 재발급 약속을 이 변수가 보관한다 */
let refreshInFlight: Promise<boolean> | null = null;

/* refreshOnce 는 app 계층이 등록한 재발급 함수를 호출한다.
   여러 요청이 동시에 불러도 재발급 요청은 한 번만 나간다 */
function refreshOnce(): Promise<boolean> {
  refreshInFlight ??= (apiClientConfig.onUnauthorized?.() ?? Promise.resolve(false)).finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

/* 인터셉터는 실패 응답을 가로채, 401 이면 토큰을 재발급해 요청을 다시 보내고
   나머지 실패는 ApiError 로 변환한다 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!(error instanceof AxiosError)) throw toApiError(error);

    /* 호출부가 취소한 요청은 실패가 아니므로 인터셉터가 변환하지 않는다 */
    if (axios.isCancel(error)) throw error;

    const config = error.config as InternalAxiosRequestConfig | undefined;
    const status = error.response?.status;

    if (
      status === 401 &&
      config &&
      !config.skipAuthRefresh &&
      !config._retried &&
      apiClientConfig.onUnauthorized
    ) {
      config._retried = true;
      if (await refreshOnce()) return axiosInstance(config);
    }

    throw normalizeError(error);
  },
);

/* normalizeError 는 axios 에러를 ApiError 로 변환하고 상태 코드를 kind 로 옮긴다 */
function normalizeError(error: AxiosError): ApiError {
  if (error.code === AxiosError.ETIMEDOUT || error.code === AxiosError.ECONNABORTED) {
    return new ApiError('timeout', 'request timed out', { cause: error });
  }
  /* 서버가 응답을 주지 못한 경우라 상태 코드가 없다 */
  if (!error.response) {
    return new ApiError('network', 'network unreachable', { cause: error });
  }

  const status = error.response.status;
  const kind = kindFromStatus(status);
  return new ApiError(kind, `HTTP ${status} ${error.config?.method} ${error.config?.url}`, {
    status,
    fieldErrors: kind === 'validation' ? parseFieldErrors(error.response.data) : undefined,
    cause: error,
    context: { path: error.config?.url },
  });
}

/* toAxiosConfig 는 RequestOptions 를 axios 설정 객체로 변환한다 */
function toAxiosConfig(options: RequestOptions = {}) {
  return {
    params: options.query,
    headers: options.headers,
    signal: options.signal,
    ...(options.timeoutMs === undefined ? {} : { timeout: options.timeoutMs }),
    skipAuthRefresh: options.skipAuthRefresh,
  };
}

/* apiClient 는 HTTP 요청 함수를 모아 둔 객체다.
   각 함수는 axios 응답에서 본문만 꺼내 반환한다 */
export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    axiosInstance.get<T>(path, toAxiosConfig(options)).then(unwrap),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    axiosInstance.post<T>(path, body, toAxiosConfig(options)).then(unwrap),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    axiosInstance.put<T>(path, body, toAxiosConfig(options)).then(unwrap),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    axiosInstance.patch<T>(path, body, toAxiosConfig(options)).then(unwrap),
  delete: <T>(path: string, options?: RequestOptions) =>
    axiosInstance.delete<T>(path, toAxiosConfig(options)).then(unwrap),

  /* upload 는 FormData 를 전송하고 진행률을 onProgress 콜백으로 알린다.
     이 요청에는 제한 시간을 두지 않는다 */
  upload: <T>(
    path: string,
    formData: FormData,
    options?: RequestOptions & { onProgress?: (percent: number) => void },
  ) =>
    axiosInstance
      .post<T>(path, formData, {
        ...toAxiosConfig(options),
        timeout: options?.timeoutMs ?? 0,
        onUploadProgress: (event) => {
          if (!options?.onProgress || !event.total) return;
          options.onProgress(Math.round((event.loaded / event.total) * 100));
        },
      })
      .then(unwrap),
};

/* unwrap 은 axios 응답에서 본문만 꺼낸다 */
function unwrap<T>(response: AxiosResponse<T>): T {
  return response.data;
}
