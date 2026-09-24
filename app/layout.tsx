/* 이 파일은 모든 화면을 감싸는 루트 레이아웃이다.
   Next 서버가 로그인 상태와 테마를 읽어 첫 HTML 부터 그 상태로 그린다 */
import type { Metadata } from 'next';
import { AppProviders } from '@/app';
import { getInitialTheme } from '@/app/server';
import { getServerSession } from '@/entities/session/server';
import { NavigationTracker } from '@/shared/routes';
import '@/index.css';

/* metadata 는 Next 가 문서의 title 과 description 에 넣는 값이다 */
export const metadata: Metadata = {
  title: 'FSD Architecture',
  description: 'FSD + Next.js App Router 아키텍처 스켈레톤',
};

/* RootLayout 은 html 과 body 를 그리고 그 안에 AppProviders 를 둔다 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  /* 두 요청을 함께 보내 둘 중 느린 쪽만큼만 기다린다 */
  const [initialSession, initialTheme] = await Promise.all([getServerSession(), getInitialTheme()]);

  return (
    /* data-brand 와 data-theme 을 첫 HTML 에 박아 화면이 나온 뒤 색이 바뀌지 않게 한다.
       시스템 설정을 따를 때는 data-theme 을 비워 브라우저가 정하게 한다 */
    <html
      lang="ko"
      data-brand={initialTheme.brand}
      data-theme={initialTheme.colorScheme === 'system' ? undefined : initialTheme.colorScheme}
    >
      <body>
        <NavigationTracker />
        <AppProviders initialSession={initialSession} initialTheme={initialTheme}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
