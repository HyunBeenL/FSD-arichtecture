import type { Meta, StoryObj } from '@storybook/nextjs';
import { Field } from './Field';
import { Input } from '../Input/Input';

const meta: Meta<typeof Field> = {
  title: 'Components/Field',
  component: Field,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => (
    <Field label="이름" htmlFor="name-input">
      <Input id="name-input" placeholder="이름을 입력하세요" />
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field label="이메일" htmlFor="email-input" required error="올바른 이메일 형식이 아닙니다">
      <Input id="email-input" type="email" invalid placeholder="email@example.com" />
    </Field>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Field label="비밀번호" htmlFor="pw-input" description="8자 이상, 특수문자 포함">
      <Input id="pw-input" type="password" />
    </Field>
  ),
};
