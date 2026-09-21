'use client';

import { useState, useCallback } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { ToastContext } from './ToastContext';
import type { ToastItem, ToastSeverity, UseToastReturn } from './ToastContext';

const SEVERITY: Record<ToastSeverity, string> = {
  default: 'border-border bg-surface-raised text-fg',
  success: 'border-success bg-success-subtle text-success-onSubtle',
  error: 'border-critical bg-critical-subtle text-critical-onSubtle',
};

/**
 * 알림 큐.
 *
 * **성공을 알리는 자리입니다.** 실패는 그 자리의 `Alert` 로 알립니다 —
 * 토스트는 사라지므로, 사용자가 다시 읽어야 하는 정보(에러 사유·다음 행동)를
 * 담으면 안 됩니다.
 *
 * `maxToasts` 를 넘으면 오래된 것부터 버립니다. 쌓이게 두면 화면을 덮습니다.
 */
export interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  swipeDirection?: 'up' | 'down' | 'left' | 'right';
}

export function ToastProvider({
  children,
  maxToasts = 5,
  swipeDirection = 'right',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback(
    (item: Omit<ToastItem, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev.slice(-(maxToasts - 1)), { ...item, id }]);
      return id;
    },
    [maxToasts],
  );

  const success = useCallback(
    (title: React.ReactNode, description?: React.ReactNode) =>
      show({ title, description, severity: 'success' }),
    [show],
  );

  const error = useCallback(
    (title: React.ReactNode, description?: React.ReactNode) =>
      show({ title, description, severity: 'error' }),
    [show],
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const api: UseToastReturn = { show, success, error, dismiss, dismissAll };

  return (
    <ToastContext.Provider value={api}>
      <RadixToast.Provider swipeDirection={swipeDirection}>
        {children}
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
        <RadixToast.Viewport className="fixed right-4 bottom-4 z-toast flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  return (
    <RadixToast.Root
      duration={toast.duration ?? 5000}
      onOpenChange={(open) => {
        if (!open) onDismiss(toast.id);
      }}
      className={cn(
        'flex items-start gap-3 rounded-card border p-3 shadow-popover',
        'data-[state=open]:animate-in data-[state=open]:slide-in-from-right-4',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out',
        SEVERITY[toast.severity ?? 'default'],
      )}
    >
      <div className="flex-1">
        {toast.title && (
          <RadixToast.Title className="text-body font-semibold">{toast.title}</RadixToast.Title>
        )}
        {toast.description && (
          <RadixToast.Description className={cn('text-body-sm', toast.title && 'mt-1')}>
            {toast.description}
          </RadixToast.Description>
        )}
      </div>
      <RadixToast.Close
        aria-label="알림 닫기"
        className="-m-1 shrink-0 rounded-sm p-1 hover:bg-surface-hover"
      >
        <X className="size-4" aria-hidden />
      </RadixToast.Close>
    </RadixToast.Root>
  );
}
