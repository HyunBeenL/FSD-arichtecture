/* 이 모듈은 로그인 상태를 보관하고, 로그인 · 로그아웃 · 복구 · 재발급을 수행한다.
   스토어를 요청마다 새로 만들어 Next 서버가 사용자 정보를 섞지 않게 한다 */
import { createStore } from 'zustand';
import { isErrorKind } from '@/shared/api';
import { sessionApi, type User } from '../api/sessionApi';

/* SessionStatus 는 화면이 로그인 상태를 판단할 때 쓰는 분류다 */
export type SessionStatus = 'restoring' | 'authenticated' | 'unauthenticated';

/* SessionState 는 스토어가 들고 있는 로그인 상태와 그 조작 함수다 */
export interface SessionState {
  /* 지금 로그인 상태가 어느 단계에 있는지 */
  status: SessionStatus;
  /* 로그인한 사용자. 로그인하지 않았으면 null 이다 */
  user: User | null;

  /* 화면이 아이디와 비밀번호로 로그인할 때 부른다 */
  login(credentials: { username: string; password: string }): Promise<void>;
  /* 화면이 로그아웃할 때 부른다. 백엔드 요청이 실패해도 상태는 비운다 */
  logout(): Promise<void>;
  /* 브라우저가 쿠키로 로그인 상태를 되살릴 때 부른다 */
  restore(): Promise<void>;
  /* 인터셉터가 401 을 만나 액세스 토큰을 다시 받을 때 부른다 */
  refresh(): Promise<boolean>;
  /* 화면이 이 사용자에게 권한이 있는지 물을 때 부른다 */
  hasPermission(permission: string): boolean;
}

/* SIGNED_OUT 은 로그인하지 않은 상태다 */
const SIGNED_OUT = { status: 'unauthenticated', user: null } as const;

/* InitialSession 은 스토어를 만들 때 넘기는 첫 상태다.
   User 면 로그인, null 이면 비로그인, undefined 면 아직 모른다는 뜻이다 */
export type InitialSession = User | null | undefined;

/* SessionStore 는 createSessionStore 가 만든 스토어 하나다 */
export type SessionStore = ReturnType<typeof createSessionStore>;

/* createSessionStore 는 로그인 상태 스토어를 하나 만든다.
   SessionProvider 가 트리마다 한 번 불러 요청끼리 상태가 섞이지 않게 한다 */
export function createSessionStore(initial: InitialSession) {
  return createStore<SessionState>()((set, get) => ({
    status: initial === undefined ? 'restoring' : initial ? 'authenticated' : 'unauthenticated',
    user: initial ?? null,

    async login(credentials) {
      const session = await sessionApi.login(credentials);
      set({ status: 'authenticated', user: session.user });
    },

    async logout() {
      try {
        await sessionApi.logout();
      } finally {
        set(SIGNED_OUT);
      }
    },

    async restore() {
      try {
        const session = await sessionApi.me();
        set({ status: 'authenticated', user: session.user });
      } catch {
        set(SIGNED_OUT);
      }
    },

    async refresh() {
      try {
        const session = await sessionApi.refresh();
        set({ status: 'authenticated', user: session.user });
        return true;
      } catch (error) {
        /* 인증이 거부된 실패만 로그아웃으로 본다. 통신 실패는 상태를 건드리지 않는다 */
        if (isErrorKind(error, 'unauthorized') || isErrorKind(error, 'forbidden')) {
          set(SIGNED_OUT);
        }
        return false;
      }
    },

    hasPermission(permission) {
      return get().user?.permissions.includes(permission) ?? false;
    },
  }));
}
