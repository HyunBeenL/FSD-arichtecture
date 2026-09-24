/* 이 모듈은 Next 서버가 쿠키로 로그인한 사용자를 읽게 한다 */
import { cache } from 'react';
import { forwardAuth } from '@/shared/api/server';
import { sessionApi } from './sessionApi';
import type { User } from './sessionApi';

/* getServerSession 은 쿠키를 인증 헤더로 옮겨 지금 사용자를 받아 온다.
   cache 로 감싸 한 요청 안에서 여러 번 불러도 백엔드 요청은 한 번만 나간다 */
export const getServerSession = cache(async (): Promise<User | null> => {
  try {
    return (await sessionApi.me(await forwardAuth())).user;
  } catch {
    return null;
  }
});
