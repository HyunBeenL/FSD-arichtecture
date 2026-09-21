import type { Meta, StoryObj } from '@storybook/nextjs';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    invalid: { control: 'boolean' },
    autoResize: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = { args: { placeholder: '내용을 입력하세요...' } };
export const AutoResize: Story = {
  args: { placeholder: '자동 높이 조절', autoResize: true, maxRows: 5 },
};
export const Invalid: Story = { args: { placeholder: '잘못된 입력', invalid: true } };
