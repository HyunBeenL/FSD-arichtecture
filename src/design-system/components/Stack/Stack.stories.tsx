import type { Meta, StoryObj } from '@storybook/nextjs';
import { Stack } from './Stack';

const Box = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: '8px 16px', background: 'var(--color-bg-muted)', borderRadius: '4px' }}>
    {children}
  </div>
);

const meta: Meta<typeof Stack> = {
  title: 'Components/Stack',
  component: Stack,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Vertical: Story = {
  render: () => (
    <Stack gap={4}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Stack direction="row" gap={4} align="center">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};
