import type { Meta, StoryObj } from '@storybook/nextjs';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: '텍스트 입력...' } };
export const Invalid: Story = { args: { placeholder: '잘못된 입력', invalid: true } };
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {['h-8', 'h-9', 'h-10'].map((h) => (
        <Input key={h} className={h} placeholder={h} />
      ))}
    </div>
  ),
};
