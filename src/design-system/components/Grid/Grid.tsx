import { cn } from '../../utils/cn';
import { gridVariants, type GridVariantProps } from './Grid.variants';

/**
 * 격자 배치.
 *
 * `columns` 는 눈금만 받습니다. 반응형 열 수는 prop 이 아니라
 * `className="grid-cols-1 md:grid-cols-3"` 으로 얹습니다 — prop 에
 * 중단점을 넣기 시작하면 모든 레이아웃 prop 이 객체를 받게 됩니다.
 */
export interface GridProps extends React.ComponentProps<'div'>, GridVariantProps {}

export function Grid({ className, columns, gap, ...props }: GridProps) {
  return <div className={cn(gridVariants({ columns, gap }), className)} {...props} />;
}
