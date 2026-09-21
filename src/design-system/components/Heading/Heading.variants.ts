import { cva, type VariantProps } from 'class-variance-authority';

export const headingVariants = cva('text-fg font-semibold text-balance', {
  variants: {
    size: {
      display: 'text-display',
      lg: 'text-title-lg',
      md: 'text-title-md',
      sm: 'text-title-sm',
    },
  },
  defaultVariants: { size: 'md' },
});

export type HeadingVariantProps = VariantProps<typeof headingVariants>;
