import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline', 'ghost'] },
    tone: { control: 'select', options: ['default', 'brand', 'critical'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: '저장' },
};

export const Outline: Story = {
  args: { children: '취소', variant: 'outline', tone: 'default' },
};

export const Ghost: Story = {
  args: { children: '더 보기', variant: 'ghost', tone: 'default' },
};

export const Critical: Story = {
  args: { children: '삭제', tone: 'critical' },
};

export const Loading: Story = {
  args: { children: '저장 중', loading: true },
};

/** variant × tone 의 유효한 조합. 열거하지 않고 compoundVariants 로 선언합니다. */
export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {(['solid', 'outline', 'ghost'] as const).map((variant) => (
        <div key={variant} className="flex gap-2">
          {(['default', 'brand', 'critical'] as const).map((tone) => (
            <Button key={tone} variant={variant} tone={tone}>
              {variant}/{tone}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};
