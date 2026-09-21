import { cn } from '../../utils/cn';

/**
 * 구분선.
 *
 * 장식이므로 기본이 `role="presentation"` 입니다. 목록 항목 사이의 의미
 * 있는 구분이라면 `<Divider role="separator" />` 로 올리십시오 — 그때만
 * 스크린 리더가 읽습니다.
 */
export interface DividerProps extends React.ComponentProps<'hr'> {
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ className, orientation = 'horizontal', ...props }: DividerProps) {
  return (
    <hr
      role="presentation"
      aria-orientation={orientation}
      className={cn(
        'border-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  );
}
