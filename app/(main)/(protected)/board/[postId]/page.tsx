/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 파일은 '/board/:postId' 에 게시글 상세 화면을 그린다 */
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getServerQueryClient } from '@/app/server';
import { BoardDetailPage } from '@/views/board';
import { prefetchBoardDetail } from '@/views/board/server';

/* Page 는 Next 서버에서 게시글을 미리 받아 브라우저에 넘긴다.
   브라우저는 같은 데이터를 다시 받지 않고 바로 화면을 그린다 */
export default async function Page({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const queryClient = getServerQueryClient();

  await prefetchBoardDetail(queryClient, postId);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BoardDetailPage postId={postId} />
    </HydrationBoundary>
  );
}
