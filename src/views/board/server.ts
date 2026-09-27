/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 board 슬라이스 중 Next 서버에서만 쓰는 것을 연다 */
import 'server-only';

import type { QueryClient } from '@tanstack/react-query';
import { POST_PREFETCH } from '@/entities/post/server';

/* prefetchBoardDetail 은 라우트가 상세 화면을 그리기 전에 게시글을 미리 받게 한다.
   라우트가 entities 를 직접 부르지 않도록 이 함수가 감싼다 */
export async function prefetchBoardDetail(queryClient: QueryClient, postId: string): Promise<void> {
  await POST_PREFETCH.detail(queryClient, postId);
}
