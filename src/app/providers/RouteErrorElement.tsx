'use client';

/* 이 모듈은 Next 의 error.tsx 가 화면 대신 그리는 폴백을 담는다 */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { errorMessageKey, isApiError } from '@/shared/api';
import { ErrorFallback } from '@/shared/ui';

/* RouteErrorElementProps 는 Next 의 error.tsx 가 넘기는 props 다 */
export interface RouteErrorElementProps {
  /* Next 가 잡은 실패 */
  error: Error;
  /* 다시 시도를 눌렀을 때 Next 가 라우트를 다시 그리게 하는 함수 */
  reset?: () => void;
}

/* RouteErrorElement 는 라우트 하나가 실패했을 때 그 자리에만 폴백을 그린다.
   ApiError 면 그 kind 에 맞는 문구를, 아니면 알 수 없는 실패 문구를 띄운다 */
export function RouteErrorElement({ error, reset }: RouteErrorElementProps) {
  const { t } = useTranslation();

  /* 이 useEffect 는 개발 중에만 실패를 콘솔에 남긴다 */
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') console.error('[RouteErrorElement]', error);
  }, [error]);

  const messageKey = isApiError(error) ? errorMessageKey(error) : 'errors:unknown';

  return (
    <ErrorFallback size="sm" title={t(messageKey)} retryLabel={t('action.retry')} onRetry={reset} />
  );
}
