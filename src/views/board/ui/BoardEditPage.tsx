'use client';

/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 이미 있는 게시글을 고치는 화면을 그린다 */
import { BackLink } from './BackLink';
import { useRouter } from 'next/navigation';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Heading, Stack, useToast } from '@/design-system';
import { POST_QUERIES, useUpdatePost } from '@/entities/post';
import { PostForm, type PostFormValues } from './PostForm';

/* BoardEditPage 는 게시글을 받아 그 값으로 채운 PostForm 을 그린다 */
export function BoardEditPage({ postId }: { postId: string }) {
  const { data: post } = useSuspenseQuery(POST_QUERIES.detail(postId));
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const update = useUpdatePost();

  /* handleSubmit 은 게시글을 고치고 알림을 띄운 뒤 그 글의 상세 화면으로 옮겨 간다.
     실패는 여기서 잡지 않는다. PostForm 이 받아 폼 위에 띄운다 */
  async function handleSubmit(values: PostFormValues) {
    const saved = await update.mutateAsync({ id: post.id, ...values });
    toast.success(t('toast.saved'));
    router.replace(`/board/${saved.id}`);
  }

  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <Heading level={1} size="md">
          글 수정
        </Heading>
        <BackLink href={`/board/${post.id}`}>취소하고 돌아가기</BackLink>
      </Stack>

      <PostForm
        defaultValues={{ title: post.title, content: post.content }}
        submitLabel="수정"
        onSubmit={handleSubmit}
      />
    </Stack>
  );
}
