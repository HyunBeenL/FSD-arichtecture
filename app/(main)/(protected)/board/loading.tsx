/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 파일은 게시판 라우트가 데이터를 기다리는 동안 그릴 화면이다 */
import { Spinner, Stack } from '@/design-system';

/* Loading 은 Next 가 라우트 전환 중에 그리는 컴포넌트다 */
export default function Loading() {
  return (
    <Stack align="center" justify="center" gap={8}>
      <Spinner size="md" aria-label="불러오는 중" />
    </Stack>
  );
}
