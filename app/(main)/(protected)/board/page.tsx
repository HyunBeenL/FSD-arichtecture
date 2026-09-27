/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 파일은 '/board' 에 게시글 목록 화면을 그린다 */
import { BoardListPage } from '@/views/board';

/* Page 는 BoardListPage 를 그린다. 목록은 URL 쿼리에 따라 달라지므로 미리 받지 않는다 */
export default function Page() {
  return <BoardListPage />;
}
