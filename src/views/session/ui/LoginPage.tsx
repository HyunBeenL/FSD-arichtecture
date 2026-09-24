'use client';

/* 이 모듈은 로그인 화면을 그리고, 로그인한 뒤 원래 가려던 곳으로 보낸다 */
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Heading, Stack, Text } from '@/design-system';
import { useSessionStore } from '@/entities/session';
import { LoginForm } from '@/features/session';

/* LoginPage 는 로그인 폼을 그린다.
   이미 로그인했거나 로그인에 성공하면 from 이 가리키는 경로로 옮겨 간다 */
export function LoginPage() {
  const status = useSessionStore((state) => state.status);
  const searchParams = useSearchParams();

  /* from 은 로그인 뒤 돌아갈 경로다.
     '/' 로 시작하고 '//' 로 시작하지 않는 값만 받아 바깥 주소로 나가지 않게 한다 */
  const raw = searchParams.get('from');
  const from = raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';

  /* 이 useEffect 는 로그인되면 페이지를 통째로 다시 불러 그 경로로 옮겨 간다.
     Next 서버가 로그인된 상태로 화면을 처음부터 다시 그리게 한다 */
  useEffect(() => {
    if (status !== 'authenticated') return;

    window.location.replace(from);
  }, [status, from]);

  /* 옮겨 가는 동안 로그인 폼이 잠깐 보이지 않게 한다 */
  if (status === 'authenticated') return null;

  return (
    <Stack gap={8}>
      <Stack gap={1}>
        <Heading level={1} size="md">
          로그인
        </Heading>
        <Text size="body" tone="muted">
          계속하려면 로그인하세요.
        </Text>
      </Stack>

      <LoginForm />
    </Stack>
  );
}
