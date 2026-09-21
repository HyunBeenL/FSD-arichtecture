'use client';

import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const TRIGGER_SIZE = {
  sm: 'h-8 text-body-sm',
  md: 'h-9 text-body',
  lg: 'h-10 text-body',
} as const;

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

/**
 * 단일 선택.
 *
 * ⚠️ **Radix Select 는 빈 문자열 `value` 를 쓸 수 없습니다.** 내부에서 빈
 * 문자열을 "선택 없음" 으로 예약하기 때문입니다. "전체" 같은 항목이
 * 필요하면 `'all'` 처럼 실제 값을 주고, 호출부에서 빈 문자열로 되돌립니다.
 *
 * 네이티브 `<select>` 대신 Radix 를 쓰는 이유는 옵션 목록의 모양을 토큰으로
 * 통제하기 위해서입니다. 대신 키보드·포커스·타입어헤드는 Radix 가 맡습니다.
 */
export interface SelectProps<T extends string = string> {
  value: T | undefined;
  onValueChange: (value: T) => void;
  options: readonly SelectOption<T>[];
  placeholder?: string;
  size?: keyof typeof TRIGGER_SIZE;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function Select<T extends string = string>({
  value,
  onValueChange,
  options,
  placeholder = '선택하세요',
  size = 'md',
  invalid,
  disabled,
  id,
  className,
}: SelectProps<T>) {
  return (
    <RadixSelect.Root
      value={value}
      onValueChange={(next) => onValueChange(next as T)}
      disabled={disabled}
    >
      <RadixSelect.Trigger
        id={id}
        aria-invalid={invalid || undefined}
        className={cn(
          'inline-flex w-full items-center justify-between gap-2 rounded-control border border-border-field bg-surface-raised px-3 text-fg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
          'disabled:cursor-not-allowed disabled:bg-surface-disabled disabled:text-fg-disabled',
          'aria-invalid:border-critical aria-invalid:ring-critical',
          'data-[placeholder]:text-fg-muted',
          TRIGGER_SIZE[size],
          className,
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDown className="size-4 text-icon" aria-hidden />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={4}
          className="z-dropdown min-w-(--radix-select-trigger-width) overflow-hidden rounded-card border border-border bg-surface-raised shadow-popover"
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={cn(
                  'relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-7 text-body text-fg outline-none select-none',
                  'data-[highlighted]:bg-surface-hover',
                  'data-[state=checked]:bg-surface-selected',
                  'data-[disabled]:text-fg-disabled',
                )}
              >
                <RadixSelect.ItemIndicator className="absolute left-2 inline-flex">
                  <Check className="size-3.5" aria-hidden />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
