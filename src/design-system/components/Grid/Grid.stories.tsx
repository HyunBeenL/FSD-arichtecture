import type { Meta, StoryObj } from '@storybook/nextjs';
import { Grid } from './Grid';

const Cell = ({ n }: { n: number }) => (
  <div
    style={{
      padding: '16px',
      background: 'var(--color-bg-muted)',
      borderRadius: '4px',
      textAlign: 'center',
    }}
  >
    {n}
  </div>
);

const meta: Meta<typeof Grid> = {
  title: 'Components/Grid',
  component: Grid,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const ThreeColumns: Story = {
  render: () => (
    <Grid columns={3} gap={4}>
      {Array.from({ length: 6 }, (_, i) => (
        <Cell key={i} n={i + 1} />
      ))}
    </Grid>
  ),
};
