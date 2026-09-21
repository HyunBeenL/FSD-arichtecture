'use client';

import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '../../utils/cn';

/**
 * 켬/끔 토글.
 *
 * **즉시 적용되는 설정에만 씁니다.** 저장 버튼을 눌러야 반영되는 폼에서는
 * 체크박스가 맞습니다 — 스위치는 "이미 바뀌었다" 로 읽힙니다.
 */
export type SwitchProps = React.ComponentProps<typeof RadixSwitch.Root>;

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <RadixSwitch.Root
      className={cn(
        'inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent bg-surface-active p-0.5 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-brand-solid',
        className,
      )}
      {...props}
    >
      <RadixSwitch.Thumb className="size-4 rounded-full bg-surface-raised shadow-card transition-transform data-[state=checked]:translate-x-4" />
    </RadixSwitch.Root>
  );
}
