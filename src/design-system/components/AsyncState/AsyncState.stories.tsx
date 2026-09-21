import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { AsyncState } from './AsyncState';
import type { AsyncStatus } from './AsyncState';
import { Button } from '../Button/Button';
import { Spinner } from '../Spinner/Spinner';
import { EmptyState } from '../EmptyState/EmptyState';
import { Alert } from '../Alert/Alert';
import { Stack } from '../Stack/Stack';

const meta: Meta<typeof AsyncState> = {
  title: 'Components/AsyncState',
  component: AsyncState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AsyncState>;

const statuses: AsyncStatus[] = ['loading', 'error', 'empty', 'ready'];

function AsyncStateDemo() {
  const [status, setStatus] = useState<AsyncStatus>('loading');

  return (
    <Stack gap={4}>
      <Stack direction="row" gap={2}>
        {statuses.map((s) => (
          <Button
            key={s}
            variant={status === s ? 'solid' : 'outline'}
            tone={status === s ? 'brand' : 'default'}
            size="sm"
            onClick={() => setStatus(s)}
          >
            {s}
          </Button>
        ))}
      </Stack>
      <AsyncState
        status={status}
        loading={
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
            <Spinner />
          </div>
        }
        error={
          <Alert tone="critical" title="Failed to load">
            An error occurred. Please try again.
          </Alert>
        }
        empty={<EmptyState icon="📭" title="No data" description="There's nothing here yet." />}
      >
        <div style={{ padding: '16px', background: 'var(--color-bg-muted)', borderRadius: '8px' }}>
          Content loaded successfully!
        </div>
      </AsyncState>
    </Stack>
  );
}

export const Interactive: Story = {
  render: () => <AsyncStateDemo />,
};
