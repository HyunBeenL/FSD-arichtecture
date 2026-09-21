import { cva, type VariantProps } from 'class-variance-authority';

export const textVariants = cva('', {
  variants: {
    size: {
      'body-lg': 'text-body-lg',
      body: 'text-body',
      'body-sm': 'text-body-sm',
      label: 'text-label',
      caption: 'text-caption',
    },
    tone: {
      default: 'text-fg',
      muted: 'text-fg-muted',
      disabled: 'text-fg-disabled',
      brand: 'text-brand',
      critical: 'text-critical',
      success: 'text-success',
      warning: 'text-warning',
      onEmphasis: 'text-fg-onEmphasis',
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    truncate: { true: 'truncate' },
  },
  defaultVariants: { size: 'body', tone: 'default', weight: 'regular' },
});

export type TextVariantProps = VariantProps<typeof textVariants>;
