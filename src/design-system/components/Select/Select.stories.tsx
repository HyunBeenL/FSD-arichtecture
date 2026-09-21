import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { Select } from './Select';

const options = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'cherry', label: '체리', disabled: true },
  { value: 'durian', label: '두리안' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

function ControlledSelect({ placeholder, invalid }: { placeholder?: string; invalid?: boolean }) {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Select
      value={value}
      onValueChange={setValue}
      options={options}
      placeholder={placeholder}
      invalid={invalid}
    />
  );
}

export const Default: Story = {
  render: () => <ControlledSelect placeholder="과일 선택" />,
};

export const Invalid: Story = {
  render: () => <ControlledSelect invalid />,
};
