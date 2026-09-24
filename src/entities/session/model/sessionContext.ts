'use client';

/* 이 모듈은 SessionProvider 가 내려 준 스토어를 하위 트리가 읽게 한다 */
import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import type { SessionState, SessionStore } from './sessionStore';

/* SessionStoreContext 는 SessionProvider 가 만든 스토어를 하위 트리에 나른다 */
export const SessionStoreContext = createContext<SessionStore | null>(null);

/* useSessionStoreApi 는 화면이 스토어 자체를 꺼내게 한다.
   렌더 밖에서 login 이나 logout 을 부를 때 쓴다 */
export function useSessionStoreApi(): SessionStore {
  const store = useContext(SessionStoreContext);
  if (!store) throw new Error('SessionProvider 밖에서 세션을 읽었습니다.');
  return store;
}

/* useSessionStore 는 화면이 로그인 상태에서 필요한 값만 골라 읽게 한다.
   고른 값이 바뀔 때만 그 화면을 다시 그린다 */
export function useSessionStore<T>(selector: (state: SessionState) => T): T {
  return useStore(useSessionStoreApi(), selector);
}
