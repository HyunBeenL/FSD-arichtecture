'use client';

/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 파일은 게시판 라우트의 실패를 받아 그 자리에만 폴백을 그린다 */
import { RouteErrorElement } from '@/app';

/* Error 는 Next 가 실패와 다시 그리기 함수를 넘겨 부르는 컴포넌트다 */
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <RouteErrorElement error={error} reset={reset} />;
}
