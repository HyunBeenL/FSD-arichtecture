import type { Meta, StoryObj } from '@storybook/nextjs';
import { ToastProvider } from './Toast';
import { useToast } from './useToast';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';

const meta: Meta = {
  title: 'Components/Toast',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj;

function ToastDemo() {
  const toast = useToast();
  return (
    <Stack direction="row" gap={4}>
      <Button
        onClick={() =>
          toast.show({ title: 'Default toast', description: 'This is a notification.' })
        }
      >
        Show default
      </Button>
      <Button
        variant="outline"
        tone="default"
        onClick={() => toast.success('Saved!', 'Your changes have been saved.')}
      >
        Show success
      </Button>
      <Button tone="critical" onClick={() => toast.error('Error', 'Something went wrong.')}>
        Show error
      </Button>
    </Stack>
  );
}

export const Default: Story = {
  render: () => <ToastDemo />,
};
