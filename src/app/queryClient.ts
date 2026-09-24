/* 이 모듈은 브라우저가 쓰는 QueryClient 를 만든다.
   재시도 여부를 ErrorKind 로 판단해 다시 보내도 소용없는 실패는 바로 포기한다 */
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { isApiError, type ErrorKind } from '@/shared/api';

/* NO_RETRY 는 다시 보내도 결과가 같은 실패다. 요청을 한 번만 보낸다 */
const NO_RETRY: ReadonlySet<ErrorKind> = new Set<ErrorKind>([
  'unauthorized',
  'forbidden',
  'notFound',
  'validation',
]);

/* NETWORK_RETRY 는 잠시 뒤 성공할 수 있는 실패다. 요청을 더 보낸다 */
const NETWORK_RETRY: ReadonlySet<ErrorKind> = new Set<ErrorKind>(['network', 'timeout']);

/* createQueryClient 는 브라우저용 QueryClient 를 하나 만든다.
   AppProviders 가 트리마다 한 번 불러 요청끼리 캐시가 섞이지 않게 한다 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    /* 읽기 실패를 콘솔에 남긴다. 화면 표시는 각 경계가 맡는다 */
    queryCache: new QueryCache({
      onError: (error, query) => {
        console.warn('[query] failed', {
          queryKey: query.queryKey,
          kind: isApiError(error) ? error.kind : 'non-api-error',
        });
      },
    }),
    /* 쓰기 실패를 콘솔에 남긴다 */
    mutationCache: new MutationCache({
      onError: (error) => {
        console.warn('[mutation] failed', {
          kind: isApiError(error) ? error.kind : 'non-api-error',
        });
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 300_000,
        refetchOnWindowFocus: false,
        /* 실패를 던지지 않는다. 경계로 올릴지는 useSuspenseQuery 를 쓰는 화면이 정한다 */
        throwOnError: false,

        /* retry 는 실패 종류에 따라 다시 보낼지 정한다 */
        retry: (failureCount, error) => {
          if (isApiError(error)) {
            if (NO_RETRY.has(error.kind)) return false;
            if (NETWORK_RETRY.has(error.kind)) return failureCount < 2;
          }
          return failureCount < 1;
        },
        /* 다시 보낼 때마다 간격을 두 배로 늘리고 30 초에서 멈춘다 */
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),
      },
      mutations: {
        throwOnError: false,
        /* 쓰기는 다시 보내지 않는다. 같은 요청이 두 번 처리될 수 있다 */
        retry: false,
      },
    },
  });
}
