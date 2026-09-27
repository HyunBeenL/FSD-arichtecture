/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 파일은 '/board/new' 에 글쓰기 화면을 그린다 */
import { BoardCreatePage } from '@/views/board';

/* Page 는 BoardCreatePage 를 그린다 */
export default function Page() {
  return <BoardCreatePage />;
}
