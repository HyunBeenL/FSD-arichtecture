import type { Meta, StoryObj } from '@storybook/nextjs';
import { Spinner } from './Spinner';
import { Stack } from '../Stack/Stack';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" align="center" gap={6}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Stack>
  ),
};
