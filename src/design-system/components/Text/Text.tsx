import { Slot } from 'radix-ui';
import { cn } from '../../utils/cn';
import { textVariants, type TextVariantProps } from './Text.variants';

/**
 * 본문 텍스트.
 *
 * 기본 요소는 `<p>` 가 아니라 `<span>` 입니다. 표 셀·버튼 안처럼 블록이
 * 들어가면 안 되는 자리가 더 많기 때문입니다. 문단이 필요하면
 * `<Text asChild><p>…</p></Text>` 로 의미를 명시합니다.
 *
 * `tone` 은 역할 이름만 받습니다. 원시 색은 유틸리티가 아예 존재하지
 * 않으므로(`--color-*: initial`) 색 리터럴이 새어 들어올 수 없습니다.
 */
export interface TextProps extends React.ComponentProps<'span'>, TextVariantProps {
  asChild?: boolean;
}

export function Text({ className, size, tone, weight, truncate, asChild, ...props }: TextProps) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp className={cn(textVariants({ size, tone, weight, truncate }), className)} {...props} />
  );
}
