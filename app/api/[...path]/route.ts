/* 이 파일은 '/api/**' 로 온 요청을 받아 handleApiProxy 에 넘긴다.
   브라우저는 백엔드를 직접 부르지 않고 이 Route Handler 만 부른다 */
import type { NextRequest } from 'next/server';
import { handleApiProxy } from '@/app/api-routes';

/* Context 는 Next 가 경로에서 뽑아 넘기는 나머지 세그먼트를 담는다 */
type Context = { params: Promise<{ path: string[] }> };

/* 아래 다섯 함수는 메서드 이름만 다르고 하는 일이 같다.
   Next 는 HTTP 메서드마다 같은 이름의 export 를 찾는다 */
export async function GET(request: NextRequest, { params }: Context) {
  return handleApiProxy(request, 'GET', (await params).path);
}
export async function POST(request: NextRequest, { params }: Context) {
  return handleApiProxy(request, 'POST', (await params).path);
}
export async function PUT(request: NextRequest, { params }: Context) {
  return handleApiProxy(request, 'PUT', (await params).path);
}
export async function PATCH(request: NextRequest, { params }: Context) {
  return handleApiProxy(request, 'PATCH', (await params).path);
}
export async function DELETE(request: NextRequest, { params }: Context) {
  return handleApiProxy(request, 'DELETE', (await params).path);
}
