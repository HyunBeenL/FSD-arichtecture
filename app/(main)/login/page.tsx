/* 이 파일은 '/login' 에 로그인 화면을 그린다 */
import { Suspense } from 'react';
import { LoginPage } from '@/views/session';

/* Page 는 LoginPage 를 Suspense 로 감싼다.
   LoginPage 가 useSearchParams 를 쓰므로 Next 가 이 경계를 요구한다 */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
