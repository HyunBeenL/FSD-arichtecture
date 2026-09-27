'use client';

/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 게시글 하나를 본문 · 수정 · 삭제와 함께 그린다 */
import { BackLink } from './BackLink';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Button, Divider, Heading, Stack, Text } from '@/design-system';
import { formatDate } from '@/shared/lib';
import { POST_QUERIES, PostStatusText } from '@/entities/post';
import { DeletePostButton } from '@/features/board';

/* BoardDetailPage 는 게시글 하나를 받아 그리고, 수정과 삭제로 가는 길을 둔다 */
export function BoardDetailPage({ postId }: { postId: string }) {
  const { data: post } = useSuspenseQuery(POST_QUERIES.detail(postId));
  const router = useRouter();

  return (
    <Stack gap={6}>
      <BackLink href="/board">목록으로</BackLink>

      <Stack gap={1}>
        <Heading level={1} size="md">
          {post.title}
        </Heading>
        <Stack direction="row" gap={1} align="center">
          <Text size="caption" tone="muted">
            {post.author} · {formatDate(post.createdAt)} ·
          </Text>
          <PostStatusText post={post} />
        </Stack>
      </Stack>

      <Stack direction="row" gap={2}>
        <Button asChild variant="outline" tone="default" size="sm">
          <RouterLink href={`/board/${post.id}/edit`}>수정</RouterLink>
        </Button>
        {/* 지운 뒤 목록으로 옮겨 가는 것은 이 화면이 정한다 */}
        <DeletePostButton
          postId={post.id}
          postTitle={post.title}
          onDeleted={() => router.replace('/board')}
        />
      </Stack>

      <Divider />

      <Text size="body">{post.content.trim() === '' ? '(내용 없음)' : post.content}</Text>
    </Stack>
  );
}
