import type { Meta, StoryObj } from '@storybook/nextjs';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['inline', 'standalone', 'subtle'] },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Inline: Story = {
  args: { children: '약관', href: '#', variant: 'inline' },
};

export const Standalone: Story = {
  args: { children: '자세히 보기', href: '#', variant: 'standalone' },
};

export const Subtle: Story = {
  args: { children: '게시글 제목', href: '#', variant: 'subtle' },
};

/** 외부 링크는 prop 이 아니라 표준 속성으로 표시합니다. */
export const External: Story = {
  args: {
    children: 'example.com',
    href: 'https://example.com',
    target: '_blank',
    rel: 'noreferrer',
    variant: 'standalone',
  },
};
