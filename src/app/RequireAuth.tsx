'use client';

/* 이 모듈은 로그인해야 볼 수 있는 화면을 감싸 로그인하지 않은 사용자를 돌려보낸다 */
import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Spinner, Stack } from '@/design-system';
import { useSessionStore } from '@/entities/session';

/* RequireAuth 는 세션을 확인하는 동안 스피너를, 로그인하지 않았으면 아무것도 그리지 않는다.
   로그인한 사용자에게만 감싼 화면을 보여 준다 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const status = useSessionStore((state) => state.status);
  const router = useRouter();
  const pathname = usePathname();

  /* 이 useEffect 는 로그인하지 않은 사용자를 로그인 화면으로 보낸다.
     지금 경로를 from 에 실어 로그인 뒤 여기로 돌아오게 한다 */
  useEffect(() => {
    if (status !== 'unauthenticated') return;
    router.replace(`/login?from=${encodeURIComponent(pathname)}`);
  }, [status, router, pathname]);

  if (status === 'restoring') {
    return (
      <Stack align="center" justify="center" gap={8}>
        <Spinner size="md" aria-label="세션 확인 중" />
      </Stack>
    );
  }

  /* 로그인 화면으로 옮겨 가는 동안 감싼 화면이 잠깐 보이지 않게 한다 */
  if (status === 'unauthenticated') return null;

  return <>{children}</>;
}
