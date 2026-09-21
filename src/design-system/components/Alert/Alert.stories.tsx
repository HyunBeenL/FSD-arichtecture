import type { Meta, StoryObj } from '@storybook/nextjs';
import { Alert } from './Alert';
import { Stack } from '../Stack/Stack';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const AllSeverities: Story = {
  render: () => (
    <Stack gap={4}>
      <Alert tone="info" title="Information">
        This is an informational message.
      </Alert>
      <Alert tone="success" title="Success">
        Your changes have been saved.
      </Alert>
      <Alert tone="warning" title="Warning">
        Please review before continuing.
      </Alert>
      <Alert tone="critical" title="Error">
        Something went wrong. Please try again.
      </Alert>
    </Stack>
  ),
};

export const Dismissible: Story = {
  render: () => (
    <Alert tone="info" title="Dismissible" onClose={() => {}}>
      Click the close button to dismiss.
    </Alert>
  ),
};
