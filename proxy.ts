import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'session';

const LOGIN_PATH = '/login';

export default function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const login = new URL(LOGIN_PATH, request.url);
  login.searchParams.set('from', request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/board/:path*'],
};
