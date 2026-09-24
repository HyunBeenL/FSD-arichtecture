'use client';

/* 이 모듈은 로그아웃 버튼을 그린다 */
import { useState } from 'react';
import { Button } from '@/design-system';
import { useSessionStore } from '@/entities/session';

/* LogoutButton 은 로그아웃 버튼을 그린다.
   누르면 백엔드에 로그아웃을 알리고 첫 화면으로 옮겨 간다 */
export function LogoutButton() {
  const logout = useSessionStore((state) => state.logout);
  /* isLoggingOut 은 로그아웃이 진행 중인지 기억한다. 버튼이 이 값으로 스피너를 그린다 */
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <Button
      size="sm"
      variant="outline"
      tone="default"
      loading={isLoggingOut}
      onClick={() => {
        setIsLoggingOut(true);
        void logout().finally(() => {
          /* 라우터 이동 대신 페이지를 통째로 다시 불러 브라우저에 남은 캐시를 비운다 */
          window.location.replace('/');
        });
      }}
    >
      로그아웃
    </Button>
  );
}
