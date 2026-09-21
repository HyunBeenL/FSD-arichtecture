import { cn } from '../../utils/cn';

/**
 * 단행 입력.
 *
 * 테두리는 `border-field` 입니다 — 장식용 `border`(1.18:1)로는 입력 컨트롤의
 * 경계 대비 3:1(WCAG 1.4.11)을 못 넘깁니다. 두 토큰을 나눈 이유가 이것입니다.
 *
 * `invalid` 는 `aria-invalid` 도 함께 세웁니다. 색 테두리만 바꾸면 스크린
 * 리더에게는 아무 일도 일어나지 않습니다.
 */
export interface InputProps extends React.ComponentProps<'input'> {
  invalid?: boolean;
}

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'h-9 w-full rounded-control border border-border-field bg-surface-raised px-3 text-body text-fg',
        'placeholder:text-fg-muted',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:cursor-not-allowed disabled:bg-surface-disabled disabled:text-fg-disabled',
        'aria-invalid:border-critical aria-invalid:ring-critical',
        className,
      )}
      {...props}
    />
  );
}
