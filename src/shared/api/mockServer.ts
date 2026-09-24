/* ⚠️ 샘플 — 백엔드가 생기면 이 파일을 통째로 지운다.
   mockServer 는 게시글과 계정을 인메모리로 들고 목록 · 로그인 · 토큰 발급을 흉내 낸다.
   app/api 의 Route Handler 가 백엔드 대신 이 모듈을 호출한다 */
import { ApiError } from './errors';
import type { QueryValue } from './api-client';

/* handleMockRequest 가 응답 전에 기다리는 시간. 로딩 상태를 눈으로 보려고 둔다 */
const LATENCY_MS = 200;

/* 목 서버가 메모리에 들고 있는 게시글 한 건 */
interface PostRecord {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  status: 'draft' | 'published';
}

/* 게시글 작성자로 돌려 쓸 이름 목록 */
const AUTHORS = ['김하늘', '이바다', '박구름', '최나무'];

/* 목 서버의 게시글 저장소. 모듈이 평가될 때 47건을 만들어 둔다 */
const posts: PostRecord[] = Array.from({ length: 47 }, (_, index) => {
  const n = 47 - index;
  return {
    id: `post-${String(n).padStart(3, '0')}`,
    title: `${n % 4 === 0 ? '[공지] ' : ''}게시글 제목 ${n}`,
    content: n % 7 === 0 ? '' : `${n}번째 글의 본문입니다.\n\n여러 줄로 작성할 수 있습니다.`,
    author: AUTHORS[n % AUTHORS.length] as string,
    createdAt: new Date(Date.UTC(2026, 0, 1 + n, 9, 0, 0)).toISOString(),
    status: n % 3 === 0 ? 'published' : 'draft',
  };
});

/* Route 핸들러가 받는 쿼리 파라미터 */
type Query = Record<string, QueryValue> | undefined;
/* Route 하나가 요청을 처리하는 함수의 모양 */
type Handler = (
  params: string[],
  body: unknown,
  query: Query,
  session: UserRecord | null,
) => unknown;

/* 목 서버가 가진 경로 하나. handleMockRequest 가 method 와 pattern 으로 고른다 */
interface Route {
  method: string;
  pattern: RegExp;
  handle: Handler;
}

/* 목 서버가 들고 있는 사용자 한 명 */
interface UserRecord {
  id: string;
  name: string;
  permissions: string[];
}

/* 로그인할 수 있는 계정. 아이디와 비밀번호가 같다 */
const CREDENTIALS: Record<string, { password: string; user: UserRecord }> = {
  demo: {
    password: 'demo',
    user: { id: 'u-1', name: '데모 사용자', permissions: ['post.read', 'post.write'] },
  },
  viewer: {
    password: 'viewer',
    user: { id: 'u-2', name: '읽기 전용', permissions: ['post.read'] },
  },
};

/* 액세스 토큰이 살아 있는 시간 */
const ACCESS_TTL_MS = 15 * 60 * 1000;
/* 리프레시 토큰이 살아 있는 시간 */
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/* 로그인과 재발급이 돌려주는 토큰 한 쌍 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/* 목 서버가 토큰 하나에 대해 기억하는 것.
   family 는 같은 로그인에서 나온 토큰들을 한 묶음으로 잇는다 */
interface TokenRecord {
  userId: string;
  expiresAt: number;
  family: string;
}

/* 발급한 액세스 토큰과 그 정보 */
const accessTokens = new Map<string, TokenRecord>();
/* 발급한 리프레시 토큰과 그 정보 */
const refreshTokens = new Map<string, TokenRecord>();

/* 이미 쓴 리프레시 토큰. 같은 토큰이 다시 오면 탈취로 보고 그 family 를 전부 버린다 */
const consumedRefreshTokens = new Map<string, string>();

/* expired 는 토큰 정보의 만료 시각이 지났는지 본다 */
function expired(record: TokenRecord): boolean {
  return record.expiresAt < Date.now();
}

/* mint 는 액세스 토큰과 리프레시 토큰을 새로 만들어 저장소에 넣는다 */
function mint(userId: string, family: string): AuthTokens {
  const accessToken = crypto.randomUUID();
  const refreshToken = crypto.randomUUID();
  const now = Date.now();

  accessTokens.set(accessToken, { userId, family, expiresAt: now + ACCESS_TTL_MS });
  refreshTokens.set(refreshToken, { userId, family, expiresAt: now + REFRESH_TTL_MS });

  return { accessToken, refreshToken, expiresIn: Math.floor(ACCESS_TTL_MS / 1000) };
}

/* issueTokens 는 로그인 성공 시 새 family 로 토큰 한 쌍을 발급한다 */
export function issueTokens(userId: string): AuthTokens {
  return mint(userId, crypto.randomUUID());
}

/* revokeFamily 는 같은 family 에서 나온 토큰을 모두 버린다 */
function revokeFamily(family: string): void {
  for (const [token, record] of accessTokens) {
    if (record.family === family) accessTokens.delete(token);
  }
  for (const [token, record] of refreshTokens) {
    if (record.family === family) refreshTokens.delete(token);
  }
}

/* rotateRefreshToken 은 리프레시 토큰을 받아 새 토큰 한 쌍으로 바꾼다.
   쓴 토큰이 다시 오면 그 family 를 전부 버리고 401 을 던진다 */
export function rotateRefreshToken(refreshToken: string | null): {
  userId: string;
  tokens: AuthTokens;
} {
  if (!refreshToken) {
    throw new ApiError('unauthorized', 'no refresh token', { status: 401 });
  }

  const reusedFamily = consumedRefreshTokens.get(refreshToken);
  if (reusedFamily) {
    revokeFamily(reusedFamily);
    throw new ApiError('unauthorized', 'refresh token reuse detected', { status: 401 });
  }

  const record = refreshTokens.get(refreshToken);
  if (!record || expired(record)) {
    refreshTokens.delete(refreshToken);
    throw new ApiError('unauthorized', 'refresh token invalid', { status: 401 });
  }

  refreshTokens.delete(refreshToken);
  consumedRefreshTokens.set(refreshToken, record.family);

  for (const [token, r] of accessTokens) {
    if (r.family === record.family) accessTokens.delete(token);
  }

  return { userId: record.userId, tokens: mint(record.userId, record.family) };
}

/* revokeSession 은 로그아웃 시 그 세션의 토큰을 모두 버린다 */
export function revokeSession(refreshToken: string | null): void {
  if (!refreshToken) return;
  const record = refreshTokens.get(refreshToken);
  if (!record) return;
  consumedRefreshTokens.set(refreshToken, record.family);
  revokeFamily(record.family);
}

/* userById 는 사용자 id 로 CREDENTIALS 에서 사용자를 찾는다 */
function userById(userId: string): UserRecord | null {
  return Object.values(CREDENTIALS).find((c) => c.user.id === userId)?.user ?? null;
}

/* findUser 는 액세스 토큰으로 사용자를 찾는다.
   토큰이 없거나 만료됐으면 null 을 돌려준다 */
export function findUser(accessToken: string | null): UserRecord | null {
  if (!accessToken) return null;

  const record = accessTokens.get(accessToken);
  if (!record) return null;

  if (expired(record)) {
    accessTokens.delete(accessToken);
    return null;
  }

  return userById(record.userId);
}

/* requireSession 은 세션이 없으면 401 을 던진다 */
function requireSession(session: UserRecord | null): UserRecord {
  if (!session) throw new ApiError('unauthorized', 'no session', { status: 401 });
  return session;
}

/* 목 서버가 처리하는 경로 목록. 인증과 게시글 두 묶음이다 */
const routes: Route[] = [
  {
    method: 'POST',
    pattern: /^\/auth\/login$/,
    handle: (_p, body) => {
      const input = body as { username: string; password: string };
      const found = CREDENTIALS[input.username];
      if (!found || found.password !== input.password) {
        throw new ApiError('unauthorized', 'invalid credentials', { status: 401 });
      }
      return { user: found.user, ...issueTokens(found.user.id) };
    },
  },
  {
    method: 'GET',
    pattern: /^\/auth\/me$/,
    handle: (_p, _b, _q, session) => ({ user: requireSession(session) }),
  },
  {
    method: 'POST',
    pattern: /^\/auth\/refresh$/,
    handle: (_p, body) => {
      const { refreshToken } = (body ?? {}) as { refreshToken?: string };
      const { userId, tokens } = rotateRefreshToken(refreshToken ?? null);
      const user = userById(userId);
      if (!user) throw new ApiError('unauthorized', 'user gone', { status: 401 });
      return { user, ...tokens };
    },
  },
  {
    method: 'POST',
    pattern: /^\/auth\/logout$/,
    handle: (_p, body) => {
      const { refreshToken } = (body ?? {}) as { refreshToken?: string };
      revokeSession(refreshToken ?? null);
      return undefined;
    },
  },

  {
    method: 'GET',
    pattern: /^\/posts$/,
    handle: (_p, _b, query) => {
      const page = num(query?.page, 1);
      const pageSize = num(query?.pageSize, 10);
      const search = str(query?.search).trim().toLowerCase();
      const status = str(query?.status);
      const sort = str(query?.sort) || 'createdAt:desc';

      let rows = posts.slice();
      if (status) rows = rows.filter((p) => p.status === status);
      if (search) {
        rows = rows.filter(
          (p) => p.title.toLowerCase().includes(search) || p.author.toLowerCase().includes(search),
        );
      }

      const [field, direction] = sort.split(':');
      const dir = direction === 'asc' ? 1 : -1;
      rows.sort((a, b) => {
        const left = field === 'title' ? a.title : a.createdAt;
        const right = field === 'title' ? b.title : b.createdAt;
        if (left !== right) return left < right ? -dir : dir;
        return a.id.localeCompare(b.id);
      });

      const start = (page - 1) * pageSize;
      return { items: rows.slice(start, start + pageSize), total: rows.length, page, pageSize };
    },
  },
  {
    method: 'GET',
    pattern: /^\/posts\/([^/]+)$/,
    handle: ([id]) => findPost(id as string),
  },
  {
    method: 'POST',
    pattern: /^\/posts$/,
    handle: (_p, body) => {
      const input = body as { title: string; content: string };
      assertTitle(input.title);
      const created: PostRecord = {
        id: `post-${crypto.randomUUID().slice(0, 8)}`,
        title: input.title.trim(),
        content: input.content,
        author: '나',
        createdAt: new Date().toISOString(),
        status: 'draft',
      };
      posts.unshift(created);
      return created;
    },
  },
  {
    method: 'PUT',
    pattern: /^\/posts\/([^/]+)$/,
    handle: ([id], body) => {
      const post = findPost(id as string);
      const input = body as { title: string; content: string };
      assertTitle(input.title);
      post.title = input.title.trim();
      post.content = input.content;
      return post;
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/posts\/([^/]+)$/,
    handle: ([id]) => {
      const index = posts.findIndex((p) => p.id === id);
      if (index === -1) throw notFound({ id });
      posts.splice(index, 1);
      return undefined;
    },
  },
];

/* handleMockRequest 는 요청에 맞는 Route 를 찾아 처리하고 결과를 돌려준다.
   맞는 경로가 없으면 404 를 던진다 */
export async function handleMockRequest<T>(
  method: string,
  path: string,
  body: unknown,
  query: Query,
  session: UserRecord | null = null,
): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

  for (const route of routes) {
    if (route.method !== method) continue;
    const match = route.pattern.exec(path);
    if (!match) continue;
    if (!path.startsWith('/auth/')) requireSession(session);
    return route.handle(match.slice(1), body, query, session) as T;
  }

  throw new ApiError('notFound', `mock route not found: ${method} ${path}`, { status: 404 });
}

/* findPost 는 id 로 게시글을 찾고, 없으면 404 를 던진다 */
function findPost(id: string): PostRecord {
  const post = posts.find((p) => p.id === id);
  if (!post) throw notFound({ id });
  return post;
}

/* 게시글 제목 길이 제한 */
const MIN_TITLE_LENGTH = 2;
const MAX_TITLE_LENGTH = 60;

/* assertTitle 은 제목이 길이 제한을 벗어나면 검증 에러를 던진다 */
function assertTitle(title: string): void {
  const trimmed = title.trim();
  if (trimmed.length < MIN_TITLE_LENGTH) {
    throw new ApiError('validation', 'title too short', {
      status: 422,
      fieldErrors: { title: [`제목은 ${MIN_TITLE_LENGTH}자 이상이어야 합니다`] },
    });
  }
  if (trimmed.length > MAX_TITLE_LENGTH) {
    throw new ApiError('validation', 'title too long', {
      status: 422,
      fieldErrors: { title: [`제목은 ${MAX_TITLE_LENGTH}자를 넘을 수 없습니다`] },
    });
  }
}

/* notFound 는 404 ApiError 를 만든다 */
function notFound(context: Record<string, unknown>): ApiError {
  return new ApiError('notFound', 'not found', { status: 404, context });
}

/* num 은 쿼리 값을 양수로 읽는다. 읽을 수 없으면 fallback 을 쓴다 */
function num(value: QueryValue, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/* str 은 쿼리 값을 문자열로 읽는다. 없으면 빈 문자열이다 */
function str(value: QueryValue): string {
  return typeof value === 'string' ? value : '';
}
