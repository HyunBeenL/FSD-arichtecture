import { cn } from '../../utils/cn';

export interface TableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  align?: 'start' | 'end';
}

/**
 * 표.
 *
 * 열을 배열로 받습니다 — `<thead>` 와 `<tbody>` 에 같은 순서를 손으로 두 번
 * 적으면 언젠가 어긋나고, 어긋나면 헤더와 값이 밀립니다.
 *
 * 가로 스크롤 컨테이너로 감쌉니다. 좁은 화면에서 표가 넘치면 페이지 전체가
 * 가로로 밀리는데, 그러면 표뿐 아니라 화면 전부가 망가집니다.
 *
 * **빈 목록은 에러가 아닙니다.** `emptyMessage` 로 표 안에서 알립니다.
 */
export interface TableProps<T> extends Omit<React.ComponentProps<'table'>, 'children'> {
  columns: ReadonlyArray<TableColumn<T>>;
  rows: readonly T[];
  rowKey: (row: T) => string;
  caption?: string;
  emptyMessage?: string;
}

export function Table<T>({
  className,
  columns,
  rows,
  rowKey,
  caption,
  emptyMessage,
  ...props
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn('w-full caption-bottom border-collapse text-body', className)}
        {...props}
      >
        {caption && <caption className="mt-3 text-caption text-fg-muted">{caption}</caption>}

        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={cn(
                  'px-3 py-2 text-label font-medium text-fg-muted',
                  column.align === 'end' ? 'text-right' : 'text-left',
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 && emptyMessage ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-8 text-center text-body text-fg-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-border hover:bg-surface-hover">
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      'px-3 py-2 text-fg',
                      column.align === 'end' ? 'text-right' : 'text-left',
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
