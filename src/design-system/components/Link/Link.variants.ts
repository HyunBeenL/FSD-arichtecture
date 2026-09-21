import { cva, type VariantProps } from 'class-variance-authority';

export const linkVariants = cva(
  [
    'rounded-sm underline-offset-4',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
  ],
  {
    variants: {
      variant: {
        /** 본문 안 — 항상 밑줄. 문장 속에서 링크를 색으로만 구분하면 안 됩니다 */
        inline: 'text-brand underline hover:text-brand-hover',
        /** 단독 배치 — 호버에만 밑줄 */
        standalone: 'text-brand hover:underline',
        /** 목록 제목처럼 본문색이어야 하는 것 */
        subtle: 'text-fg hover:underline',
      },
    },
    defaultVariants: { variant: 'inline' },
  },
);

export type LinkVariantProps = VariantProps<typeof linkVariants>;
