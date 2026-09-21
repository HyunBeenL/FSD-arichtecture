import type { Meta, StoryObj } from '@storybook/nextjs';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-80">
      <p className="text-body">위</p>
      <Divider className="my-4" />
      <p className="text-body">아래</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-4">
      <span className="text-body">왼쪽</span>
      <Divider orientation="vertical" />
      <span className="text-body">오른쪽</span>
    </div>
  ),
};
