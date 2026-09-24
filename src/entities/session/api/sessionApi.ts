/* 이 모듈은 로그인 · 로그아웃 · 세션 조회 API 를 부르고,
   받은 응답이 Session 모양인지 검사한다 */
import { z } from 'zod';
import { apiClient, type RequestOptions } from '@/shared/api';

/* userSchema 는 로그인한 사용자가 갖춰야 할 모양이다 */
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.array(z.string()),
});

/* User 는 로그인한 사용자 한 명이다. permissions 로 화면의 권한을 판단한다 */
export type User = z.infer<typeof userSchema>;

/* sessionSchema 는 인증 API 의 응답이 갖춰야 할 모양이다.
   토큰은 HttpOnly 쿠키로 오가므로 본문에 담기지 않는다 */
const sessionSchema = z.object({
  user: userSchema,
});

/* Session 은 인증 API 가 돌려주는 로그인 상태다 */
export type Session = z.infer<typeof sessionSchema>;

/* sessionApi 는 인증 API 네 개를 모은다.
   네 요청 모두 401 을 받아도 인터셉터가 토큰 재발급을 시도하지 않는다 */
export const sessionApi = {
  /* login 은 아이디와 비밀번호를 보내고 로그인된 사용자를 돌려받는다 */
  async login(credentials: { username: string; password: string }): Promise<Session> {
    return sessionSchema.parse(await apiClient.post<unknown>('/auth/login', credentials));
  },

  /* me 는 지금 쿠키로 로그인된 사용자를 돌려받는다.
     Next 서버가 부를 때는 쿠키를 헤더로 옮겨 options 에 담아 넘긴다 */
  async me(options?: RequestOptions): Promise<Session> {
    return sessionSchema.parse(
      await apiClient.get<unknown>('/auth/me', { ...options, skipAuthRefresh: true }),
    );
  },

  /* refresh 는 리프레시 토큰으로 새 액세스 토큰을 받는다.
     인터셉터가 401 을 만났을 때 부르는 요청이다 */
  async refresh(): Promise<Session> {
    return sessionSchema.parse(
      await apiClient.post<unknown>('/auth/refresh', undefined, { skipAuthRefresh: true }),
    );
  },

  /* logout 은 백엔드가 쿠키와 리프레시 토큰을 버리게 한다 */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout', undefined, { skipAuthRefresh: true });
  },
};
