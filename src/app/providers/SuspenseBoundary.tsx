'use client';

/* 이 모듈은 불러오는 중과 실패를 한 자리에서 받는 경계를 담는다 */
import { Suspense, type ReactNode } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Spinner, Stack } from '@/design-system';
import { AppErrorBoundary } from './AppErrorBoundary';

/* SuspenseBoundaryProps 는 화면이 SuspenseBoundary 에 넘기는 props 다 */
export interface SuspenseBoundaryProps {
  /* 이 경계가 감쌀 화면 */
  children: ReactNode;
  /* 기본 스피너 대신 그릴 대기 화면 */
  fallback?: ReactNode;
}

/* DefaultFallback 은 넘겨받은 대기 화면이 없을 때 그리는 스피너다 */
function DefaultFallback() {
  return (
    <Stack align="center" justify="center" gap={8}>
      <Spinner size="md" aria-label="불러오는 중" />
    </Stack>
  );
}

/* SuspenseBoundary 는 데이터를 기다리는 동안 대기 화면을, 실패하면 폴백을 그린다.
   다시 시도를 누르면 실패한 쿼리를 지우고 하위 트리를 다시 그린다 */
export function SuspenseBoundary({ children, fallback }: SuspenseBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <AppErrorBoundary onReset={reset}>
          <Suspense fallback={fallback ?? <DefaultFallback />}>{children}</Suspense>
        </AppErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
