import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { Radio } from './Radio';

const options = [
  { value: 'a', label: '옵션 A' },
  { value: 'b', label: '옵션 B' },
  { value: 'c', label: '옵션 C (비활성)', disabled: true },
];

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Radio>;

function ControlledRadio({ orientation }: { orientation: 'vertical' | 'horizontal' }) {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Radio value={value} onValueChange={setValue} options={options} orientation={orientation} />
  );
}

export const Vertical: Story = {
  render: () => <ControlledRadio orientation="vertical" />,
};

export const Horizontal: Story = {
  render: () => <ControlledRadio orientation="horizontal" />,
};
