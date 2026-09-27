/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 파일은 '/board/:postId/edit' 에 글 수정 화면을 그린다 */
import { BoardEditPage } from '@/views/board';

/* Page 는 BoardEditPage 를 그린다 */
export default async function Page({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  return <BoardEditPage postId={postId} />;
}
