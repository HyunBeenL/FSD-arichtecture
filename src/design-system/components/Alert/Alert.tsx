import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { alertVariants, type AlertVariantProps } from './Alert.variants';

const ICON = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  critical: XCircle,
} as const;

/**
 * 상황 알림.
 *
 * **색만으로 의미를 전달하지 않습니다** (WCAG 1.4.1). tone 마다 아이콘이
 * 다르므로 색각 이상 사용자도 구분됩니다.
 *
 * `role` 은 tone 이 정합니다 — `critical` 만 `alert`(즉시 읽음)이고 나머지는
 * `status`(다음 틈에 읽음)입니다. 안내문까지 낭독을 끊으면 방해가 됩니다.
 */
export interface AlertProps extends Omit<React.ComponentProps<'div'>, 'title'>, AlertVariantProps {
  title?: React.ReactNode;
  onClose?: () => void;
}

export function Alert({
  className,
  tone = 'info',
  title,
  onClose,
  children,
  ...props
}: AlertProps) {
  const Icon = ICON[tone ?? 'info'];

  return (
    <div
      role={tone === 'critical' ? 'alert' : 'status'}
      className={cn(alertVariants({ tone }), className)}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        {children && <div className={cn(title && 'mt-1')}>{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="알림 닫기"
          className="-m-1 h-fit shrink-0 rounded-sm p-1 hover:bg-surface-hover"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
