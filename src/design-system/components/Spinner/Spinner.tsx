import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const SIZE = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
} as const;

/**
 * 진행 표시.
 *
 * `ds-spinner` 클래스가 붙어 있습니다. `prefers-reduced-motion` 전역
 * 규칙이 모든 애니메이션을 1ms 로 죽이는데, 진행 표시까지 멈추면 **정보가
 * 사라지므로** 이 클래스만 예외로 되살립니다 (tokens/semantic.css).
 *
 * 화면에 읽어 줄 이름이 없으면 `aria-label` 을 주십시오. 주변 텍스트가
 * 이미 "불러오는 중" 을 말하고 있다면 `aria-hidden` 이 맞습니다.
 */
export interface SpinnerProps extends React.ComponentProps<'svg'> {
  size?: keyof typeof SIZE;
}

export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  return (
    <Loader2
      role="status"
      className={cn('ds-spinner shrink-0 animate-spin text-icon', SIZE[size], className)}
      {...props}
    />
  );
}
