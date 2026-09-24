/* ⚠️ 샘플 — 목 서버에 붙어 있다. 백엔드가 생기면 handleMockRequest 부분을 실제 전달로 바꾼다.
   이 모듈은 브라우저 요청을 받아 토큰을 HttpOnly 쿠키로 바꿔 넣는다 */
import { NextResponse, type NextRequest } from 'next/server';
import { isApiError, toApiError } from '@/shared/api';
import { findUser, handleMockRequest } from '@/shared/api/server';

/* ACCESS_COOKIE 는 액세스 토큰을 담는 쿠키 이름이다.
   shared/api/serverHeaders 의 SESSION_COOKIE 와 같은 값이어야 한다 */
const ACCESS_COOKIE = 'session';

/* REFRESH_COOKIE 는 리프레시 토큰을 담는 쿠키 이름이다 */
const REFRESH_COOKIE = 'refresh';

/* BASE_COOKIE_OPTIONS 는 두 쿠키가 함께 쓰는 설정이다.
   httpOnly 로 자바스크립트가 토큰을 읽지 못하게 한다 */
const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
} as const;

/* ACCESS_COOKIE_OPTIONS 는 액세스 토큰 쿠키를 모든 경로에 보낸다 */
const ACCESS_COOKIE_OPTIONS = { ...BASE_COOKIE_OPTIONS, path: '/' } as const;

/* REFRESH_COOKIE_OPTIONS 는 리프레시 토큰 쿠키를 인증 경로에만 보낸다.
   다른 요청에는 실리지 않아 새어 나갈 자리를 줄인다 */
const REFRESH_COOKIE_OPTIONS = { ...BASE_COOKIE_OPTIONS, path: '/api/auth' } as const;

/* AuthPayload 는 로그인과 재발급 응답에 담겨 오는 토큰이다.
   이 모듈은 이 값을 쿠키로 옮기고 본문에서는 지운다 */
interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/* extractToken 은 요청에서 액세스 토큰을 꺼낸다.
   Authorization 헤더를 먼저 보고, 없으면 쿠키에서 꺼낸다 */
function extractToken(request: NextRequest): string | null {
  const header = request.headers.get('authorization');
  if (header?.startsWith('Bearer ')) return header.slice('Bearer '.length);
  return request.cookies.get(ACCESS_COOKIE)?.value ?? null;
}

/* stripTokens 는 응답 본문에서 토큰 세 개를 지운다.
   브라우저는 토큰을 본문으로 받지 않고 쿠키로만 받는다 */
function stripTokens(data: unknown): unknown {
  const rest = { ...(data as Record<string, unknown>) };
  delete rest.accessToken;
  delete rest.refreshToken;
  delete rest.expiresIn;
  return rest;
}

/* setAuthCookies 는 받은 토큰 두 개를 응답의 쿠키에 싣는다 */
function setAuthCookies(response: NextResponse, tokens: AuthPayload): void {
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    ...ACCESS_COOKIE_OPTIONS,
    maxAge: tokens.expiresIn,
  });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
}

/* handleApiProxy 는 /api 로 온 요청을 처리하고 응답을 돌려준다.
   Route Handler 가 메서드마다 이 함수를 부른다 */
export async function handleApiProxy(
  request: NextRequest,
  method: string,
  segments: string[],
): Promise<NextResponse> {
  const path = `/${segments.join('/')}`;
  const query = Object.fromEntries(request.nextUrl.searchParams.entries());

  let body: unknown;
  if (method !== 'GET' && method !== 'DELETE') {
    const raw = await request.text();
    body = raw ? (JSON.parse(raw) as unknown) : undefined;
  }

  /* 재발급과 로그아웃은 브라우저가 못 읽는 쿠키를 써야 하므로 본문을 여기서 만든다 */
  if (path === '/auth/refresh' || path === '/auth/logout') {
    body = { refreshToken: request.cookies.get(REFRESH_COOKIE)?.value ?? null };
  }

  const session = findUser(extractToken(request));

  try {
    const data = await handleMockRequest<unknown>(method, path, body, query, session);

    /* 로그인과 재발급만 토큰을 준다. 그 응답은 본문 대신 쿠키로 옮긴다 */
    const issuesTokens = path === '/auth/login' || path === '/auth/refresh';

    const payload = issuesTokens ? stripTokens(data) : data;

    const response =
      payload === undefined ? new NextResponse(null, { status: 204 }) : NextResponse.json(payload);

    if (issuesTokens) setAuthCookies(response, data as AuthPayload);

    /* 로그아웃은 두 쿠키를 만료시켜 브라우저가 버리게 한다 */
    if (path === '/auth/logout') {
      response.cookies.set(ACCESS_COOKIE, '', { ...ACCESS_COOKIE_OPTIONS, maxAge: 0 });
      response.cookies.set(REFRESH_COOKIE, '', { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });
    }

    return response;
  } catch (caught) {
    /* 어떤 실패든 상태 코드와 메시지를 갖춘 JSON 으로 바꿔 돌려준다 */
    const error = toApiError(caught);
    const status = error.status ?? (isApiError(caught) ? 400 : 500);
    return NextResponse.json(
      { message: error.message, fieldErrors: error.fieldErrors },
      { status },
    );
  }
}
