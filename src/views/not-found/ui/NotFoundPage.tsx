'use client';

/* 이 모듈은 주소에 맞는 화면이 없을 때 대신 그릴 화면을 담는다 */
import { useTranslation } from 'react-i18next';
import RouterLink from 'next/link';
import { EmptyState, Link } from '@/design-system';

/* NotFoundPage 는 찾지 못했다는 안내와 첫 화면으로 가는 링크를 그린다.
   루트의 not-found.tsx 와 라우트별 not-found 가 함께 쓴다 */
export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <EmptyState
      title={t('errors:notFound')}
      action={
        <Link asChild variant="standalone">
          <RouterLink href="/">{t('action.home', { defaultValue: '홈으로' })}</RouterLink>
        </Link>
      }
    />
  );
}
