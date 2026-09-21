import { cn } from '../../utils/cn';

/**
 * 로딩 자리 표시.
 *
 * `aria-hidden` 입니다 — 스크린 리더에게 빈 회색 상자는 정보가 아닙니다.
 * 로딩 상태는 감싸는 영역이 `aria-busy` 로 알립니다.
 *
 * `animate-pulse` 는 `prefers-reduced-motion` 전역 규칙이 멈춥니다. 진행
 * 표시가 아니라 장식이라 멈춰도 정보가 사라지지 않습니다.
 */
export interface SkeletonProps extends React.ComponentProps<'div'> {
  variant?: 'text' | 'circle' | 'rect';
}

export function Skeleton({ className, variant = 'rect', ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse bg-surface-active',
        variant === 'text' && 'h-4 w-full rounded-sm',
        variant === 'circle' && 'size-10 rounded-full',
        variant === 'rect' && 'h-16 w-full rounded-card',
        className,
      )}
      {...props}
    />
  );
}
