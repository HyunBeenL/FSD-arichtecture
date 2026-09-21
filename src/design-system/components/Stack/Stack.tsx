import { Slot } from 'radix-ui';
import { cn } from '../../utils/cn';
import { stackVariants, type StackVariantProps } from './Stack.variants';

/**
 * `BlockStack` / `InlineStack` 으로 나누지 않습니다.
 *
 * 반응형으로 축이 바뀌는 경우(데스크톱 row → 좁은 화면 column)에 **두
 * 컴포넌트를 갈아 끼우는 것은 불가능**하기 때문입니다. `direction` prop
 * 하나로 두고, 반응형은 `className="flex-col md:flex-row"` 로 얹습니다.
 *
 * `gap` 은 4px 그리드의 눈금만 받습니다. 임의값을 허용하면 그리드가
 * 무너지고, 그리드에 맞지 않는 간격이 필요하다면 대개 구조가 틀린 것입니다.
 */
export interface StackProps extends Omit<React.ComponentProps<'div'>, 'dir'>, StackVariantProps {
  /**
   * 다른 요소로 렌더합니다.
   *
   * `<form>` · `<ul>` 처럼 **의미가 필요한 컨테이너**에 배치만 얹을 때
   * 씁니다. `<Stack asChild><form …>` 이 대표적입니다.
   */
  asChild?: boolean;
}

export function Stack({
  className,
  direction,
  gap,
  align,
  justify,
  wrap,
  asChild,
  ...props
}: StackProps) {
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp
      className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)}
      {...props}
    />
  );
}
