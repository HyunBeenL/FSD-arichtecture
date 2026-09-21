import { cn } from '../../utils/cn';
import { fieldIds } from './fieldIds';

/**
 * 라벨 · 설명 · 에러를 입력 컨트롤에 묶습니다.
 *
 * **묶는 일이 본체입니다.** `htmlFor` 로 라벨을 연결하고, 설명·에러의 id 를
 * 만들어 컨트롤이 `aria-describedby` 로 가리키게 합니다. 시각적으로 붙여
 * 놓기만 하면 스크린 리더에게는 서로 무관한 텍스트 세 덩이입니다.
 *
 * `describedBy` 는 컨트롤이 직접 받아야 하므로 `fieldIds()` 를 함께
 * 내보냅니다 — 이 컴포넌트가 children 에 props 를 주입하지 않는 이유는,
 * 주입하면 children 의 모양(단일 요소·Fragment 금지 등)을 제약하게 되기
 * 때문입니다.
 */
export interface FieldProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  label: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function Field({
  className,
  label,
  htmlFor,
  description,
  error,
  required,
  children,
  ...props
}: FieldProps) {
  const { descriptionId, errorId } = fieldIds(htmlFor, {
    description: Boolean(description),
    error: Boolean(error),
  });

  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...props}>
      <label className="text-label font-medium text-fg" htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="text-critical" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-caption text-fg-muted">
          {description}
        </p>
      )}

      {children}

      {error && (
        <p id={errorId} role="alert" className="text-caption text-critical">
          {error}
        </p>
      )}
    </div>
  );
}
