'use client';

/* 이 모듈은 헤더 · 본문 · 푸터로 이루어진 앱의 기본 골격을 그린다 */
import type { ReactNode } from 'react';
import { usePageMetaValue } from '@/shared/lib';
import { useRouteMeta } from '@/shared/routes';

/* AppLayoutProps 는 app 계층이 AppLayout 에 넘기는 props 다 */
export interface AppLayoutProps {
  /* 기본 헤더 대신 그릴 헤더 */
  header?: ReactNode;
  /* 기본 푸터 대신 그릴 푸터 */
  footer?: ReactNode;
  /* 본문에 그릴 화면 */
  children?: ReactNode;
}

/* AppLayout 은 라우트가 정한 제목 · 이동 경로와 화면이 올린 제목 · 액션을 헤더에 그린다.
   화면이 제목을 올렸으면 라우트가 정한 제목 대신 그것을 쓴다 */
export function AppLayout({ header, footer, children }: AppLayoutProps) {
  const routeMeta = useRouteMeta();
  const pageMeta = usePageMetaValue();

  const title = pageMeta.title ?? routeMeta.title;
  const showFooter = !routeMeta.hideFooter;

  return (
    <div className="flex min-h-screen flex-col bg-surface text-fg">
      {header ?? (
        <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-4 md:px-8">
          {/* min-w-0 은 긴 제목이 오른쪽 액션 영역을 밀어내지 않게 한다 */}
          <div className="flex min-w-0 flex-col gap-1">
            {routeMeta.breadcrumb && routeMeta.breadcrumb.length > 0 && (
              <nav aria-label="현재 위치" className="text-caption text-fg-muted">
                {routeMeta.breadcrumb.join(' › ')}
              </nav>
            )}
            {/* truncate 는 긴 제목을 줄바꿈 대신 잘라 헤더 높이를 고정한다 */}
            {title && <h1 className="truncate text-title-sm font-semibold text-fg">{title}</h1>}
          </div>
          {pageMeta.actions && (
            <div className="flex shrink-0 items-center gap-2">{pageMeta.actions}</div>
          )}
        </header>
      )}

      <main className="flex-1 px-4 py-4 md:px-8">{children}</main>

      {showFooter &&
        (footer ?? (
          <footer className="border-t border-border px-4 py-4 text-caption text-fg-muted md:px-8" />
        ))}
    </div>
  );
}
