import { cn } from '../../utils/cn';
import { headingVariants, type HeadingVariantProps } from './Heading.variants';

/**
 * 제목.
 *
 * **`level` 과 `size` 를 분리합니다.** `level` 은 문서 개요(h1~h6)이고
 * `size` 는 시각 크기입니다. 둘을 묶으면 "작게 보이게 하려고 h4 를 쓰는"
 * 일이 생겨 스크린 리더의 개요가 무너집니다.
 */
export interface HeadingProps extends React.ComponentProps<'h2'>, HeadingVariantProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ className, level = 2, size, ...props }: HeadingProps) {
  const Comp = `h${level}` as const;

  return <Comp className={cn(headingVariants({ size }), className)} {...props} />;
}
