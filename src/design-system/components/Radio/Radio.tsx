'use client';

import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import { cn } from '../../utils/cn';

export interface RadioOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

/**
 * 단일 선택 — 선택지가 눈에 다 보여야 할 때.
 *
 * 선택지가 5~6개를 넘으면 `Select` 로 바꿉니다. 라디오는 전부 펼쳐 놓는
 * 것이 장점이자 한계입니다.
 *
 * 개별 라디오를 따로 두지 않고 그룹만 내보냅니다 — 라디오는 혼자 있을 때
 * 의미가 없고, 낱개로 열면 `name` 을 안 묶는 실수가 생깁니다.
 */
export interface RadioGroupProps<T extends string = string> extends Omit<
  React.ComponentProps<typeof RadixRadioGroup.Root>,
  'onValueChange' | 'value'
> {
  value?: T;
  onValueChange?: (value: T) => void;
  options: readonly RadioOption<T>[];
}

export function Radio<T extends string = string>({
  className,
  options,
  value,
  onValueChange,
  ...props
}: RadioGroupProps<T>) {
  return (
    <RadixRadioGroup.Root
      value={value}
      onValueChange={(next) => onValueChange?.(next as T)}
      className={cn('flex flex-col gap-2', className)}
      {...props}
    >
      {options.map((option) => {
        const id = `${props.name ?? 'radio'}-${option.value}`;
        return (
          <div key={option.value} className="flex items-center gap-2">
            <RadixRadioGroup.Item
              id={id}
              value={option.value}
              disabled={option.disabled}
              className={cn(
                'inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-border-field bg-surface-raised',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                'disabled:cursor-not-allowed disabled:bg-surface-disabled',
                'data-[state=checked]:border-brand',
              )}
            >
              <RadixRadioGroup.Indicator className="size-2 rounded-full bg-brand-solid" />
            </RadixRadioGroup.Item>
            <label htmlFor={id} className="text-body text-fg">
              {option.label}
            </label>
          </div>
        );
      })}
    </RadixRadioGroup.Root>
  );
}
