import type { Meta, StoryObj } from '@storybook/nextjs';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['text', 'circle', 'rect'] } },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = { args: { variant: 'text' } };
export const Circle: Story = { args: { variant: 'circle' } };
export const Rect: Story = { args: { variant: 'rect' } };

/** 크기는 prop 이 아니라 className 으로 줍니다 — 자리마다 달라지는 값입니다. */
export const Composed: Story = {
  render: () => (
    <div className="flex w-80 items-center gap-3">
      <Skeleton variant="circle" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
    </div>
  ),
};
