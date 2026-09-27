/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 게시글 읽기 요청을 TanStack Query 가 쓰는 형태로 묶는다 */
import { queryOptions } from '@tanstack/react-query';
import type { RequestOptions } from '@/shared/api';
import { getPost, getPostList, type PostListQuery } from './post.api';

/* POST_QUERIES 는 게시글 캐시 키와 읽기 요청을 한곳에 모은다.
   화면과 Next 서버는 이 객체를 거쳐야 같은 키를 쓴다 */
export const POST_QUERIES = {
  /* 게시글 캐시 전체를 가리키는 키 */
  all: () => ['post'] as const,

  /* 모든 목록 캐시를 가리키는 키. 쓰기 뒤 목록을 한꺼번에 무효화할 때 쓴다 */
  lists: () => [...POST_QUERIES.all(), 'list'] as const,

  /* 쿼리 하나에 해당하는 목록을 받아 오는 설정 */
  list: (query: PostListQuery, options?: RequestOptions) =>
    queryOptions({
      queryKey: [...POST_QUERIES.lists(), query] as const,
      queryFn: ({ signal }) => getPostList(query, { ...options, signal }),
    }),

  /* 모든 상세 캐시를 가리키는 키 */
  details: () => [...POST_QUERIES.all(), 'detail'] as const,

  /* 게시글 하나를 받아 오는 설정 */
  detail: (id: string, options?: RequestOptions) =>
    queryOptions({
      queryKey: [...POST_QUERIES.details(), id] as const,
      queryFn: ({ signal }) => getPost(id, { ...options, signal }),
    }),
};
