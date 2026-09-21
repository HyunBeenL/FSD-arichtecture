import { Slot } from 'radix-ui';
import { cn } from '../../utils/cn';
import { buttonVariants, type ButtonVariantProps } from '../Button/Button.variants';

const SQUARE = {
  sm: 'size-8 p-0',
  md: 'size-9 p-0',
  lg: 'size-10 p-0',
} as const;

/**
 * 아이콘만 있는 버튼.
 *
 * `Button` 의 variants 를 그대로 쓰고 가로 패딩만 정사각으로 덮습니다.
 * 별도 cva 를 만들면 tone 이 하나 늘 때 두 곳을 고치게 됩니다.
 *
 * **`label` 이 필수입니다.** 아이콘에는 읽을 텍스트가 없어 이름이 없으면
 * 스크린 리더에 "버튼" 으로만 들립니다 (WCAG 4.1.2).
 */
export interface IconButtonProps
  extends Omit<React.ComponentProps<'button'>, 'children'>, Omit<ButtonVariantProps, 'fullWidth'> {
  label: string;
  icon: React.ReactNode;
  asChild?: boolean;
}

export function IconButton({
  className,
  variant = 'ghost',
  tone = 'default',
  size = 'md',
  label,
  icon,
  asChild,
  type,
  ...props
}: IconButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      type={asChild ? type : (type ?? 'button')}
      aria-label={label}
      className={cn(buttonVariants({ variant, tone, size }), SQUARE[size ?? 'md'], className)}
      {...props}
    >
      {icon}
    </Comp>
  );
}
