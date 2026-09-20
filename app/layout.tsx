/* 이 파일은 모든 화면을 감싸는 루트 레이아웃이다.
   Provider 조립은 src/app 계층이 맡는다 — 이 파일은 html 과 body 만 그린다 */
import type { Metadata } from 'next';
import '@/index.css';

/* metadata 는 Next 가 문서의 title 과 description 에 넣는 값이다 */
export const metadata: Metadata = {
  title: 'FSD Architecture',
  description: 'FSD + Next.js App Router 아키텍처 스켈레톤',
};

/* RootLayout 은 라우팅 트리의 최상단에서 children 을 감싼다 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
