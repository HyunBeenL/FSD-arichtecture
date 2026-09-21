'use client';

import { useContext } from 'react';
import { ToastContext } from './ToastContext';
import type { UseToastReturn } from './ToastContext';

export function useToast(): UseToastReturn {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
