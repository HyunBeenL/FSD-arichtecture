import type { Meta, StoryObj } from '@storybook/nextjs';
import { Text } from './Text';
import { Stack } from '../Stack/Stack';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Sizes: Story = {
  render: () => (
    <Stack gap={2}>
      <Text size="body">Body text — the default size for paragraphs</Text>
      <Text size="caption">Caption text — labels and helper text</Text>
    </Stack>
  ),
};

export const Weights: Story = {
  render: () => (
    <Stack gap={2}>
      <Text weight="regular">Regular weight</Text>
      <Text weight="medium">Medium weight</Text>
      <Text weight="semibold">Semibold weight</Text>
      <Text weight="semibold">Bold weight</Text>
    </Stack>
  ),
};

export const TruncateSingle: Story = {
  render: () => (
    <div style={{ width: '200px' }}>
      <Text truncate>This is a long text that will be truncated to a single line.</Text>
    </div>
  ),
};

export const TruncateMulti: Story = {
  render: () => (
    <div style={{ width: '200px' }}>
      <Text truncate>
        This is a longer text that will be clamped to exactly two lines using webkit-line-clamp.
      </Text>
    </div>
  ),
};
