/* 이 모듈은 목록 아래에 페이지 이동 버튼을 그린다 */
import { Button, Stack, Text } from '@/design-system';
import { PAGE_ELLIPSIS, pageNumbers } from './pageNumbers';

/* PaginationProps 는 화면이 Pagination 에 넘기는 props 다 */
export interface PaginationProps {
  /* 사용자가 지금 보고 있는 페이지 번호 */
  page: number;
  /* 목록 전체의 페이지 수 */
  totalPages: number;
  /* 사용자가 다른 페이지를 눌렀을 때 부를 함수 */
  onChange: (page: number) => void;
}

/* Pagination 은 이전 · 페이지 번호 · 다음 버튼을 그린다.
   페이지가 한 장뿐이면 아무것도 그리지 않는다 */
export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Stack direction="row" gap={1} wrap>
      <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        이전
      </Button>

      {pageNumbers(page, totalPages).map((n, index) =>
        n === PAGE_ELLIPSIS ? (
          <Text key={`gap-${index}`} size="caption" tone="muted">
            …
          </Text>
        ) : (
          <Button
            key={n}
            size="sm"
            variant={n === page ? 'solid' : 'ghost'}
            tone={n === page ? 'brand' : 'default'}
            onClick={() => onChange(n)}
          >
            {n}
          </Button>
        ),
      )}

      <Button
        size="sm"
        variant="ghost"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        다음
      </Button>
    </Stack>
  );
}
