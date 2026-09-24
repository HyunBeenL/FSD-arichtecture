/* 이 모듈은 Next 서버가 미리 받기에 쓰는 QueryClient 를 만든다 */
import { cache } from 'react';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { isApiError } from '@/shared/api';

/* getServerQueryClient 는 이번 요청의 QueryClient 를 돌려준다.
   cache 로 감싸 한 요청 안에서는 같은 것을 쓰고, 요청끼리는 섞이지 않게 한다 */
export const getServerQueryClient = cache(
  () =>
    new QueryClient({
      /* 미리 받기 실패를 콘솔에 남긴다. 화면은 브라우저에서 다시 받는다 */
      queryCache: new QueryCache({
        onError: (error, query) => {
          console.warn('[server-query] prefetch failed', {
            queryKey: query.queryKey,
            kind: isApiError(error) ? error.kind : 'non-api-error',
            message: error instanceof Error ? error.message : String(error),
          });
        },
      }),
      defaultOptions: {
        queries: {
          staleTime: 30_000,
          /* 미리 받기는 다시 보내지 않는다. 첫 응답이 늦어지면 화면이 그만큼 늦게 나온다 */
          retry: false,
        },
      },
    }),
);
