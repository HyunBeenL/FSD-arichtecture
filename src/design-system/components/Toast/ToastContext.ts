'use client';

import { createContext } from 'react';
import type { ReactNode } from 'react';

export type ToastSeverity = 'default' | 'success' | 'error';

export interface ToastItem {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  severity?: ToastSeverity;
  duration?: number;
}

export interface UseToastReturn {
  show: (item: Omit<ToastItem, 'id'>) => string;
  success: (title: ReactNode, description?: ReactNode) => string;
  error: (title: ReactNode, description?: ReactNode) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export const ToastContext = createContext<UseToastReturn | null>(null);
