/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 post 슬라이스 중 Next 서버에서만 쓰는 것을 연다 */
import 'server-only';

import type { QueryClient } from '@tanstack/react-query';
import { prefetchAuthedOrNotFound } from '@/shared/api/server';
import { POST_QUERIES } from './api/post.query';

/* POST_PREFETCH 는 라우트가 화면을 그리기 전에 게시글을 미리 받게 한다 */
export const POST_PREFETCH = {
  /* 게시글 하나를 미리 받는다. 백엔드가 404 를 주면 not-found 화면으로 보낸다 */
  detail: (queryClient: QueryClient, id: string) =>
    prefetchAuthedOrNotFound(queryClient, (auth) => POST_QUERIES.detail(id, auth)),
};
