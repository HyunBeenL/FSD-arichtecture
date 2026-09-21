import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

/** 라벨은 Checkbox 가 그리지 않습니다 — Field 또는 htmlFor 로 묶습니다. */
function Controlled() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="cb" checked={checked} onCheckedChange={(next) => setChecked(next === true)} />
      <label htmlFor="cb" className="text-body">
        약관에 동의합니다
      </label>
    </div>
  );
}

export const Default: Story = { render: () => <Controlled /> };

export const Indeterminate: Story = {
  render: () => <Checkbox checked="indeterminate" onCheckedChange={() => {}} />,
};

export const Invalid: Story = {
  render: () => <Checkbox checked={false} onCheckedChange={() => {}} invalid />,
};
