'use client';

/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 게시글 목록 화면을 검색 · 필터 · 정렬 · 페이지 이동과 함께 그린다 */
import { BackLink } from './BackLink';
import RouterLink from 'next/link';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Button, Divider, Heading, Input, Select, Stack, Text } from '@/design-system';
import { useListParams, type ListQuery } from '@/shared/lib';
import { Pagination } from '@/shared/ui';
import { POST_QUERIES, type PostListQuery } from '@/entities/post';
import { PostTable } from '@/widgets/board';

/* STATUS_ALL 은 상태를 거르지 않음을 나타내는 선택지 값이다.
   이 값을 고르면 화면은 URL 에서 status 를 지운다 */
const STATUS_ALL = 'all';

/* STATUS_OPTIONS 는 상태 필터 select 에 그릴 선택지다 */
const STATUS_OPTIONS = [
  { value: STATUS_ALL, label: '전체' },
  { value: 'published', label: '발행됨' },
  { value: 'draft', label: '임시 저장' },
];

/* toPostListQuery 는 useListParams 가 돌려준 쿼리를 게시글 API 의 쿼리로 본다 */
function toPostListQuery(query: ListQuery): PostListQuery {
  return query as PostListQuery;
}

/* BoardListPage 는 URL 이 가리키는 조건으로 게시글 목록을 받아 표로 그린다 */
export function BoardListPage() {
  const params = useListParams({
    defaultSort: 'createdAt:desc',
    defaultPageSize: 10,
    filterKeys: ['status'],
  });

  const { data } = useSuspenseQuery(POST_QUERIES.list(toPostListQuery(params.query)));

  /* 게시글이 없어도 페이지는 한 장으로 센다 */
  const totalPages = Math.max(1, Math.ceil(data.total / params.pageSize));

  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <Heading level={1} size="lg">
          게시판
        </Heading>
        <BackLink href="/">홈으로</BackLink>
      </Stack>

      <Stack direction="row" gap={2} wrap>
        <Input
          value={params.searchInput}
          onChange={(event) => params.setSearchInput(event.target.value)}
          placeholder="제목·작성자 검색"
          aria-label="검색"
        />
        <Select
          value={params.filters.status || STATUS_ALL}
          onValueChange={(status) =>
            params.setFilter('status', status === STATUS_ALL ? '' : status)
          }
          options={STATUS_OPTIONS}
          size="md"
        />
        <Button variant="ghost" onClick={() => params.toggleSort('createdAt')}>
          작성일 {params.sort.field === 'createdAt' && params.sort.direction === 'asc' ? '↑' : '↓'}
        </Button>
        <Button asChild>
          <RouterLink href="/board/new">글쓰기</RouterLink>
        </Button>
      </Stack>

      <Text size="caption" tone="muted">
        {data.total}건
      </Text>

      <PostTable posts={data.items} />

      <Divider />

      <Pagination page={params.page} totalPages={totalPages} onChange={params.setPage} />
    </Stack>
  );
}
