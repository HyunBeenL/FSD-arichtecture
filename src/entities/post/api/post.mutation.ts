'use client';

/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 게시글 쓰기 요청을 훅으로 묶고, 성공하면 관련 캐시를 무효화한다 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, deletePost, updatePost } from './post.api';
import type { CreatePostInput, UpdatePostInput } from './post.api';
import { POST_QUERIES } from './post.query';

/* POST_MUTATIONS 는 게시글 쓰기 요청을 가리키는 키를 모은다.
   화면은 이 키로 진행 중인 쓰기를 찾는다 */
export const POST_MUTATIONS = {
  /* 게시글 쓰기 전체를 가리키는 키 */
  all: () => ['post'] as const,

  /* 게시글 생성을 가리키는 키 */
  create: () => [...POST_MUTATIONS.all(), 'create'] as const,

  /* 게시글 수정을 가리키는 키 */
  update: () => [...POST_MUTATIONS.all(), 'update'] as const,

  /* 게시글 삭제를 가리키는 키 */
  remove: () => [...POST_MUTATIONS.all(), 'remove'] as const,
};

/* useCreatePost 는 화면이 게시글을 새로 만들게 한다.
   성공하면 목록 캐시를 무효화해 새 글이 목록에 나타나게 한다 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: POST_MUTATIONS.create(),
    mutationFn: (input: CreatePostInput) => createPost(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: POST_QUERIES.lists() });
    },
  });
}

/* useUpdatePost 는 화면이 게시글을 고치게 한다.
   성공하면 그 글의 상세 캐시와 목록 캐시를 무효화한다 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: POST_MUTATIONS.update(),
    mutationFn: (input: UpdatePostInput) => updatePost(input),
    onSuccess: (post) => {
      void queryClient.invalidateQueries({ queryKey: POST_QUERIES.detail(post.id).queryKey });
      void queryClient.invalidateQueries({ queryKey: POST_QUERIES.lists() });
    },
  });
}

/* useDeletePost 는 화면이 게시글을 지우게 한다.
   성공하면 목록 캐시를 무효화해 지운 글이 목록에서 빠지게 한다 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: POST_MUTATIONS.remove(),
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: POST_QUERIES.lists() });
    },
  });
}
