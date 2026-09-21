import { cva, type VariantProps } from 'class-variance-authority';

/** variant(강조 방식)와 tone(업무 의미)을 독립된 축으로 조합합니다. */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-control font-medium whitespace-nowrap',
    'transition-colors duration-[var(--ds-duration-fast)] select-none',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
  ],
  {
    variants: {
      variant: {
        solid: '',
        outline: 'border bg-surface-raised',
        ghost: 'bg-transparent',
      },
      tone: { default: '', brand: '', critical: '' },
      size: {
        sm: 'h-8 px-3 text-body-sm',
        md: 'h-9 px-4 text-body',
        lg: 'h-10 px-6 text-body',
      },
      fullWidth: { true: 'w-full' },
    },
    compoundVariants: [
      {
        variant: 'solid',
        tone: 'brand',
        class: 'bg-brand-solid text-fg-onEmphasis hover:bg-brand-hover active:bg-brand-active',
      },
      {
        variant: 'solid',
        tone: 'critical',
        class:
          'bg-critical-solid text-fg-onEmphasis hover:bg-critical-hover active:bg-critical-active',
      },
      {
        variant: 'solid',
        tone: 'default',
        class: 'bg-surface-sunken text-fg hover:bg-surface-active',
      },
      {
        variant: 'outline',
        tone: 'default',
        class: 'border-border-field text-fg hover:bg-surface-hover',
      },
      { variant: 'outline', tone: 'brand', class: 'border-brand text-brand hover:bg-brand-subtle' },
      {
        variant: 'outline',
        tone: 'critical',
        class: 'border-critical text-critical hover:bg-critical-subtle',
      },
      { variant: 'ghost', tone: 'default', class: 'text-fg hover:bg-surface-hover' },
      { variant: 'ghost', tone: 'brand', class: 'text-brand hover:bg-brand-subtle' },
      { variant: 'ghost', tone: 'critical', class: 'text-critical hover:bg-critical-subtle' },
    ],
    defaultVariants: { variant: 'solid', tone: 'brand', size: 'md' },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
