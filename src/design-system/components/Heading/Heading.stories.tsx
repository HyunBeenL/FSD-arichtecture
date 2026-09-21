import type { Meta, StoryObj } from '@storybook/nextjs';
import { Heading } from './Heading';
import { Stack } from '../Stack/Stack';

const meta: Meta<typeof Heading> = {
  title: 'Components/Heading',
  component: Heading,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const AllLevels: Story = {
  render: () => (
    <Stack gap={4}>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} level={level}>
          Heading level {level}
        </Heading>
      ))}
    </Stack>
  ),
};

export const SemanticVsVisual: Story = {
  render: () => (
    <Stack gap={4}>
      <Heading level={1} size="sm">
        h1 with size="sm"
      </Heading>
      <Heading level={6} size="lg">
        h6 with size="lg"
      </Heading>
    </Stack>
  ),
};
