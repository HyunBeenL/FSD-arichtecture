import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva('flex gap-3 rounded-card border p-4 text-body', {
  variants: {
    tone: {
      info: 'border-info bg-info-subtle text-info-onSubtle',
      success: 'border-success bg-success-subtle text-success-onSubtle',
      warning: 'border-warning bg-warning-subtle text-warning-onSubtle',
      critical: 'border-critical bg-critical-subtle text-critical-onSubtle',
    },
  },
  defaultVariants: { tone: 'info' },
});

export type AlertVariantProps = VariantProps<typeof alertVariants>;
