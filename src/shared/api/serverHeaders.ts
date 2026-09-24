/* 이 모듈은 Next 서버에서 세션 쿠키를 읽어 Authorization 헤더로 만든다 */
import { cookies } from 'next/headers';
import type { RequestOptions } from './api-client';

/* Next 서버가 액세스 토큰을 담아 두는 쿠키 이름.
   apiProxy.ts 와 같은 값이어야 한다 */
const SESSION_COOKIE = 'session';

/* forwardAuth 는 세션 쿠키를 읽어 Authorization 헤더가 담긴 RequestOptions 를 만든다.
   쿠키가 없으면 빈 객체를 돌려준다 */
export async function forwardAuth(): Promise<RequestOptions> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}
