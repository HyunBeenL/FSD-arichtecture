'use client';

import { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

/**
 * 여러 줄 입력.
 *
 * `autoResize` 는 내용에 맞춰 높이를 늘립니다. `maxRows` 를 넘으면 스크롤로
 * 바뀝니다 — 상한이 없으면 긴 글에서 화면이 통째로 밀립니다.
 *
 * 훅을 쓰므로 `'use client'` 가 필요합니다. 이 지시어가 없으면 admin 같은
 * SPA 에서는 아무 일도 없고, Next 의 Server Component 가 이 파일을 import
 * 하는 순간에만 터집니다 — 그때는 원인을 좁히기 어렵습니다.
 */
export interface TextareaProps extends React.ComponentProps<'textarea'> {
  invalid?: boolean;
  autoResize?: boolean;
  maxRows?: number;
}

export function Textarea({
  className,
  invalid,
  autoResize,
  maxRows,
  rows = 3,
  ref,
  ...props
}: TextareaProps) {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const resolvedRef = (ref as React.RefObject<HTMLTextAreaElement>) ?? internalRef;

  useEffect(() => {
    if (!autoResize) return;
    const el = resolvedRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = parseInt(getComputedStyle(el).lineHeight || '24', 10);
    const maxHeight = maxRows ? lineHeight * maxRows : Infinity;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  });

  return (
    <textarea
      ref={resolvedRef}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full rounded-control border border-border-field bg-surface-raised px-3 py-2 text-body text-fg',
        'placeholder:text-fg-muted',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:cursor-not-allowed disabled:bg-surface-disabled disabled:text-fg-disabled',
        'aria-invalid:border-critical aria-invalid:ring-critical',
        autoResize ? 'resize-none overflow-hidden' : 'resize-y',
        className,
      )}
      {...props}
    />
  );
}
