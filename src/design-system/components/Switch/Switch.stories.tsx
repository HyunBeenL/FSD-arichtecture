import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Switch>;

function Controlled() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Switch id="sw" checked={on} onCheckedChange={setOn} />
      <label htmlFor="sw" className="text-body">
        알림 받기
      </label>
    </div>
  );
}

export const Default: Story = { render: () => <Controlled /> };

export const Checked: Story = { render: () => <Switch checked onCheckedChange={() => {}} /> };

export const Disabled: Story = {
  render: () => <Switch checked disabled onCheckedChange={() => {}} />,
};
