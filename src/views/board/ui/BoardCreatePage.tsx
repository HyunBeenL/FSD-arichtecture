'use client';

/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 게시글을 새로 쓰는 화면을 그린다 */
import { BackLink } from './BackLink';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Heading, Stack, useToast } from '@/design-system';
import { useCreatePost } from '@/entities/post';
import { PostForm, type PostFormValues } from './PostForm';

/* BoardCreatePage 는 빈 PostForm 을 그리고, 저장하면 만들어진 글로 옮겨 간다 */
export function BoardCreatePage() {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const create = useCreatePost();

  /* handleSubmit 은 게시글을 만들고 알림을 띄운 뒤 그 글의 상세 화면으로 옮겨 간다.
     실패는 여기서 잡지 않는다. PostForm 이 받아 폼 위에 띄운다 */
  async function handleSubmit(values: PostFormValues) {
    const created = await create.mutateAsync(values);
    toast.success(t('toast.saved'));
    router.replace(`/board/${created.id}`);
  }

  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <Heading level={1} size="md">
          글쓰기
        </Heading>
        <BackLink href="/board">취소하고 돌아가기</BackLink>
      </Stack>

      <PostForm submitLabel="저장" onSubmit={handleSubmit} />
    </Stack>
  );
}
