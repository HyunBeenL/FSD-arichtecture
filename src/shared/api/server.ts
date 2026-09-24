/* 이 모듈은 shared/api 중 Next 서버에서만 쓰는 것을 모아 연다.
   next/headers 를 쓰므로 배럴이 아니라 이 파일로 내보낸다 */
import 'server-only';

import { notFound } from 'next/navigation';
import type { FetchQueryOptions, QueryClient, QueryKey } from '@tanstack/react-query';
import type { RequestOptions } from './api-client';
import { isErrorKind } from './errors';
import { forwardAuth } from './serverHeaders';

/* Next 서버가 쿠키를 Authorization 헤더로 바꿀 때 쓴다 */
export { forwardAuth } from './serverHeaders';

/* ⚠️ 샘플 — 목 서버를 Route Handler 에 연결한다. 백엔드가 생기면 이 줄을 지운다 */
export { findUser, handleMockRequest } from './mockServer';

/* prefetchAuthed 는 라우트가 인증된 요청으로 데이터를 미리 받게 한다.
   실패하면 삼키고, 브라우저가 다시 받는다 */
export async function prefetchAuthed<TData, TKey extends QueryKey>(
  queryClient: QueryClient,
  build: (auth: RequestOptions) => FetchQueryOptions<TData, Error, TData, TKey>,
): Promise<void> {
  await queryClient.prefetchQuery(build(await forwardAuth()));
}

/* prefetchAuthedOrNotFound 는 라우트가 데이터를 미리 받게 하고,
   서버가 404 를 주면 Next 의 not-found 화면으로 보낸다 */
export async function prefetchAuthedOrNotFound<TData, TKey extends QueryKey>(
  queryClient: QueryClient,
  build: (auth: RequestOptions) => FetchQueryOptions<TData, Error, TData, TKey>,
): Promise<void> {
  const auth = await forwardAuth();

  try {
    await queryClient.fetchQuery(build(auth));
  } catch (error) {
    if (isErrorKind(error, 'notFound')) notFound();
  }
}
