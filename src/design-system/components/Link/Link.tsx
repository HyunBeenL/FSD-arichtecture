import { Slot } from 'radix-ui';
import { cn } from '../../utils/cn';
import { linkVariants, type LinkVariantProps } from './Link.variants';

/**
 * 링크.
 *
 * **라우터를 모릅니다.** `next/link` 든 `react-router` 든 `asChild` 로 받습니다.
 *
 * ```tsx
 * <Link asChild variant="subtle"><NextLink href="/board">목록</NextLink></Link>
 * ```
 *
 * 디자인 시스템이 라우팅 라이브러리를 import 하면 별도 패키지로 떼어낼 수
 * 없게 되고, 라우터를 갈아 끼울 때 부품이 통째로 묶여 따라옵니다.
 */
export interface LinkProps extends React.ComponentProps<'a'>, LinkVariantProps {
  asChild?: boolean;
}

export function Link({ className, variant, asChild, ...props }: LinkProps) {
  const Comp = asChild ? Slot.Root : 'a';

  return <Comp className={cn(linkVariants({ variant }), className)} {...props} />;
}
