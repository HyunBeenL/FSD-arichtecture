'use client';

import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * 체크박스.
 *
 * 라운드가 `rounded-sm`(4px)입니다 — 컨트롤(6px)보다 한 단계 작습니다.
 * 중첩되는 모서리는 안쪽이 더 작아야 시각적으로 어긋나지 않습니다.
 *
 * 라벨은 이 컴포넌트가 그리지 않습니다. `Field` 가 `htmlFor` 로 묶습니다 —
 * 여기서 라벨을 함께 그리면 `Field` 와 두 벌이 됩니다.
 */
export interface CheckboxProps extends React.ComponentProps<typeof RadixCheckbox.Root> {
  invalid?: boolean;
}

export function Checkbox({ className, invalid, ...props }: CheckboxProps) {
  return (
    <RadixCheckbox.Root
      aria-invalid={invalid || undefined}
      className={cn(
        'inline-flex size-4 shrink-0 items-center justify-center rounded-sm border border-border-field bg-surface-raised',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:cursor-not-allowed disabled:bg-surface-disabled',
        'data-[state=checked]:border-brand data-[state=checked]:bg-brand-solid data-[state=checked]:text-fg-onEmphasis',
        'data-[state=indeterminate]:border-brand data-[state=indeterminate]:bg-brand-solid data-[state=indeterminate]:text-fg-onEmphasis',
        'aria-invalid:border-critical',
        className,
      )}
      {...props}
    >
      <RadixCheckbox.Indicator className="inline-flex">
        {props.checked === 'indeterminate' ? (
          <Minus className="size-3" aria-hidden />
        ) : (
          <Check className="size-3" aria-hidden />
        )}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
}
