'use client';

/* 이 모듈은 앱 전체가 쓰는 Provider 들을 정해진 순서로 쌓는다 */
import { useEffect, useMemo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, ToastProvider, type Brand, type ColorScheme } from '@/design-system';
import { configureApiClient } from '@/shared/api';
import { I18nProvider } from '@/shared/lib';
import {
  SessionProvider,
  useSessionStore,
  useSessionStoreApi,
  type InitialSession,
} from '@/entities/session';
import { createQueryClient } from '../queryClient';
import { AppErrorBoundary } from './AppErrorBoundary';
import { RootErrorBoundary } from './RootErrorBoundary';
import { SuspenseBoundary } from './SuspenseBoundary';

/* InitialTheme 은 Next 서버가 쿠키에서 읽어 넘기는 첫 테마다 */
export interface InitialTheme {
  /* 라이트 · 다크 · 시스템 중 사용자가 고른 것 */
  colorScheme: ColorScheme;
  /* 사용자가 고른 브랜드 색 */
  brand: Brand;
}

/* AppProviders 는 루트 레이아웃이 화면 전체를 감싸는 컴포넌트다.
   아래 주석의 번호는 바깥에서 안으로 쌓이는 순서다 */
export function AppProviders({
  initialSession,
  initialTheme,
  children,
}: {
  initialSession: InitialSession;
  initialTheme: InitialTheme;
  children: React.ReactNode;
}) {
  /* useMemo 로 감싸 이 트리에서 QueryClient 를 한 번만 만든다 */
  const queryClient = useMemo(() => createQueryClient(), []);

  return (
    /* 1. 아래 전부가 죽었을 때 쓰는 마지막 경계. 디자인 시스템 없이 그린다 */
    <RootErrorBoundary>
      {/* 2. 토큰 적용 (data-theme·data-brand). 색을 쓰는 것은 전부 이 아래 */}
      <ThemeProvider
        defaultColorScheme={initialTheme.colorScheme}
        defaultBrand={initialTheme.brand}
      >
        {/* 3. 번역. 문구를 쓰는 것은 이 아래 */}
        <I18nProvider>
          {/* 4. 토큰·t() 를 쓰는 리치 폴백. 2·3 이 준비된 뒤여야 한다 */}
          <AppErrorBoundary>
            {/* 5. 알림. 렌더 실패가 앱 전체를 죽이지 않도록 4 안에 둔다 */}
            <ToastProvider>
              {/* 6. 서버 상태. 9 가 useQueryClient 를 쓰므로 그보다 위 */}
              <QueryClientProvider client={queryClient}>
                {/* 7. 요청마다 새 스토어. 8 이 인스턴스를 보려면 그보다 위 */}
                <SessionProvider initialSession={initialSession}>
                  {/* 8. 아무것도 그리지 않는다 — 순서 보장과 인스턴스 접근용 */}
                  <ApiClientWiring />
                  {/* 9. QueryErrorReset + AppErrorBoundary 둘 다 쓴다 → 가장 안쪽 */}
                  <SuspenseBoundary>{children}</SuspenseBoundary>
                </SessionProvider>
              </QueryClientProvider>
            </ToastProvider>
          </AppErrorBoundary>
        </I18nProvider>
      </ThemeProvider>
    </RootErrorBoundary>
  );
}

/* ApiClientWiring 은 apiClient 에 재발급 함수를 등록하고, 첫 진입에 세션을 되살린다.
   화면에 아무것도 그리지 않는다 */
function ApiClientWiring() {
  const store = useSessionStoreApi();
  const needsRestore = useSessionStore((state) => state.status) === 'restoring';

  /* 인터셉터가 401 을 만나면 이 함수로 액세스 토큰을 다시 받는다 */
  configureApiClient({ onUnauthorized: () => store.getState().refresh() });

  /* 이 useEffect 는 Next 서버가 사용자를 넘기지 못했을 때 쿠키로 세션을 되살린다 */
  useEffect(() => {
    if (needsRestore) void store.getState().restore();
  }, [needsRestore, store]);

  return null;
}
