'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * 모달 대화상자.
 *
 * `title` 이 필수입니다 — Radix 는 `Dialog.Title` 이 없으면 접근 가능한
 * 이름이 없다고 콘솔에 경고합니다. 제목 없는 모달은 스크린 리더에서
 * "대화상자" 로만 들립니다.
 *
 * **확인 흐름은 여기 두지 않습니다.** "정말 삭제할까요" 는 그 행위를 가진
 * feature 가 조립합니다 — 모달이 도메인을 알면 화면마다 복제됩니다.
 */
export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  className,
}: ModalProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={cn(
            'fixed inset-0 z-overlay bg-surface-overlay',
            'data-[state=open]:animate-in data-[state=open]:fade-in',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out',
          )}
        />
        <RadixDialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-modal w-full max-w-md -translate-x-1/2 -translate-y-1/2',
            'rounded-card border border-border bg-surface-raised p-6 shadow-modal',
            'focus-visible:outline-none',
            'data-[state=open]:animate-in data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:zoom-out-95',
            className,
          )}
        >
          <div className="flex flex-col gap-1.5">
            <RadixDialog.Title className="text-title-sm font-semibold text-fg">
              {title}
            </RadixDialog.Title>
            {description && (
              <RadixDialog.Description className="text-body text-fg-muted">
                {description}
              </RadixDialog.Description>
            )}
          </div>

          {children && <div className="mt-4">{children}</div>}

          {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}

          {showCloseButton && (
            <RadixDialog.Close
              aria-label="닫기"
              className="absolute top-4 right-4 rounded-sm p-1 text-icon hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <X className="size-4" aria-hidden />
            </RadixDialog.Close>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
