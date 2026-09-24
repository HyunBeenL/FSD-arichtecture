'use client';

/* 이 파일은 어느 라우트도 잡지 못한 실패를 받는 Next 의 에러 화면이다 */
import { RouteErrorElement } from '@/app';

/* Error 는 Next 가 실패와 다시 그리기 함수를 넘겨 부르는 컴포넌트다 */
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <RouteErrorElement error={error} reset={reset} />;
}
