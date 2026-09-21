import { cn } from '../../utils/cn';

/**
 * 빈 상태.
 *
 * **빈 목록은 에러가 아닙니다.** 정상 응답이므로 에러 경계로 보내지 않고
 * 화면이 직접 그립니다. `title` 은 무슨 일이 없는지, `action` 은 무엇을 할
 * 수 있는지 — 둘 다 없으면 사용자가 막힙니다.
 */
export interface EmptyStateProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-card px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      {icon && <div className="text-icon-subtle">{icon}</div>}
      <p className="text-title-sm font-semibold text-fg">{title}</p>
      {description && <p className="text-body text-fg-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
