import type { Meta, StoryObj } from '@storybook/nextjs';
import { EmptyState } from './EmptyState';
import { Button } from '../Button/Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  render: () => (
    <EmptyState
      icon="📭"
      title="No results found"
      description="Try adjusting your search or filter to find what you're looking for."
      action={
        <Button variant="outline" tone="default">
          Clear filters
        </Button>
      }
    />
  ),
};

export const Minimal: Story = {
  render: () => <EmptyState title="No items yet" />,
};
