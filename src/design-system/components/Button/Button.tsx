import { Loader2 } from 'lucide-react';
import { Slot } from 'radix-ui';
import { cn } from '../../utils/cn';
import { buttonVariants, type ButtonVariantProps } from './Button.variants';

/**
 * variant 와 tone 을 나눈 이유.
 *
 * 축을 나누지 않고 `variant: 'critical' | 'criticalOutline' | 'criticalGhost'`
 * 로 열거하면 tone 이 하나 늘 때마다 variant 가 3개씩 늘어납니다. CVA 의
 * `compoundVariants` 는 유효한 조합을 **선언적으로** 적습니다.
 *
 * ## `warning` · `success` tone 은 버튼에 없습니다
 *
 * 버튼은 사용자가 **실행하는 동작**이고, 경고·성공은 **결과의 상태**입니다.
 * 그것은 `Alert` 의 축입니다.
 *
 * ## 화면당 solid/brand 는 하나
 *
 * 주 액션이 둘이면 사용자가 무엇을 눌러야 할지 모릅니다.
 */
export interface ButtonProps extends React.ComponentProps<'button'>, ButtonVariantProps {
  /**
   * 다른 요소로 렌더합니다 (`<a>` · 라우터 Link 등).
   *
   * **주의** — Slot 은 props 를 병합할 뿐 HTML 의미를 옮기지 않습니다.
   * `<a>` 에는 native `disabled` 가 동작하지 않으므로 `asChild + disabled`
   * 는 지원하지 않습니다. 비활성 링크가 필요하면 조건부 렌더로 바꾸십시오.
   */
  asChild?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function Button({
  className,
  variant,
  tone,
  size,
  fullWidth,
  asChild,
  loading,
  disabled,
  startIcon,
  endIcon,
  type,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  // 번들러가 정적으로 치환하므로 프로덕션 번들에서는 이 블록이 통째로 제거됩니다.
  if (process.env.NODE_ENV !== 'production' && asChild && disabled) {
    console.error('[Button] asChild + disabled 는 지원하지 않습니다. 조건부 렌더로 바꾸십시오.');
  }

  return (
    <Comp
      // form 안의 button 은 기본이 submit 입니다. 명시하지 않으면 취소 버튼이 제출합니다.
      type={asChild ? type : (type ?? 'button')}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, tone, size, fullWidth }), className)}
      {...props}
    >
      {loading ? (
        <Loader2 className="ds-spinner size-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        startIcon
      )}
      {/*
        Slot 은 자식이 **정확히 하나**여야 합니다. 아이콘을 함께 넣으면 둘이
        되므로, 어느 쪽이 위임 대상인지 Slottable 로 표시합니다.
      */}
      <Slot.Slottable>{children}</Slot.Slottable>
      {!loading && endIcon}
    </Comp>
  );
}
