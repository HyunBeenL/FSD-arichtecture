'use client';

/* 이 모듈은 로그인 상태 스토어를 만들어 하위 트리에 내려 준다 */
import { useState, type ReactNode } from 'react';
import { SessionStoreContext } from './sessionContext';
import { createSessionStore, type InitialSession } from './sessionStore';

/* SessionProvider 는 app 계층이 트리 맨 위에 두는 컴포넌트다.
   Next 서버가 읽은 사용자를 initialSession 으로 받아 첫 화면부터 로그인 상태로 그린다 */
export function SessionProvider({
  initialSession,
  children,
}: {
  initialSession: InitialSession;
  children: ReactNode;
}) {
  /* useState 로 감싸 이 트리에서 스토어를 한 번만 만든다 */
  const [store] = useState(() => createSessionStore(initialSession));

  return <SessionStoreContext.Provider value={store}>{children}</SessionStoreContext.Provider>;
}
