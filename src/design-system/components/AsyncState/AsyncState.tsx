import { cn } from '../../utils/cn';

export type AsyncStatus = 'loading' | 'error' | 'empty' | 'ready';

/**
 * 네 상태 중 하나를 그립니다.
 *
 * **상태 값을 밖에서 받습니다.** 디자인 시스템은 데이터 라이브러리를 모르므로
 * `useQuery` 의 결과를 직접 읽지 않습니다. 호출부가 `status` 로 번역해서
 * 넘깁니다 — 그래야 TanStack Query 든 다른 것이든 같은 부품을 씁니다.
 *
 * `aria-busy` 를 세우므로 로딩 중에는 보조 기술이 "바쁨" 으로 읽습니다.
 */
export interface AsyncStateProps extends React.ComponentProps<'div'> {
  status: AsyncStatus;
  loading?: React.ReactNode;
  error?: React.ReactNode;
  empty?: React.ReactNode;
}

export function AsyncState({
  className,
  status,
  loading,
  error,
  empty,
  children,
  ...props
}: AsyncStateProps) {
  return (
    <div aria-busy={status === 'loading' || undefined} className={cn(className)} {...props}>
      {status === 'loading' && (loading ?? null)}
      {status === 'error' && (error ?? null)}
      {status === 'empty' && (empty ?? null)}
      {status === 'ready' && children}
    </div>
  );
}
