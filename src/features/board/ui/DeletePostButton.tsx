'use client';

/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 게시글 삭제 버튼과 그 확인 창을 그린다 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Modal, Stack, Text, useToast } from '@/design-system';
import { errorMessageKey } from '@/shared/api';
import { useDeletePost } from '@/entities/post';

/* DeletePostButtonProps 는 화면이 DeletePostButton 에 넘기는 props 다 */
export interface DeletePostButtonProps {
  /* 지울 게시글의 id */
  postId: string;
  /* 확인 창에 보여 줄 게시글 제목 */
  postTitle?: string;
  /* 버튼의 크기 */
  size?: 'sm' | 'md';
  /* 삭제에 성공한 뒤 부를 함수. 화면은 여기서 목록으로 옮겨 간다 */
  onDeleted?: () => void;
}

/* DeletePostButton 은 삭제 버튼을 그리고, 누르면 확인 창을 띄운다.
   확인하면 게시글을 지우고 알림을 띄운 뒤 onDeleted 를 부른다 */
export function DeletePostButton({
  postId,
  postTitle,
  size = 'sm',
  onDeleted,
}: DeletePostButtonProps) {
  const { t } = useTranslation();
  const toast = useToast();
  /* confirmOpen 은 확인 창이 열려 있는지 기억한다 */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const remove = useDeletePost();

  /* handleDelete 는 게시글을 지우고 확인 창을 닫는다.
     실패하면 확인 창을 열어 둔 채 아래 Alert 가 그 실패를 보여 준다 */
  async function handleDelete() {
    try {
      await remove.mutateAsync(postId);
      toast.success(t('toast.deleted'));
      setConfirmOpen(false);
      onDeleted?.();
    } catch {
      return;
    }
  }

  return (
    <>
      <Button tone="critical" size={size} onClick={() => setConfirmOpen(true)}>
        {t('action.delete')}
      </Button>

      <Modal
        open={confirmOpen}
        onOpenChange={(next) => {
          /* 확인 창을 다시 열 때 앞선 실패를 지운다 */
          if (next) remove.reset();
          setConfirmOpen(next);
        }}
        title={t('post.deleteTitle')}
        description={t('post.deleteDescription')}
        footer={
          <Stack direction="row" gap={2}>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              {t('action.cancel')}
            </Button>
            <Button tone="critical" loading={remove.isPending} onClick={() => void handleDelete()}>
              {t('action.delete')}
            </Button>
          </Stack>
        }
      >
        <Stack gap={2}>
          {postTitle && <Text size="body">{postTitle}</Text>}
          {remove.error && <Alert tone="critical" title={t(errorMessageKey(remove.error))} />}
        </Stack>
      </Modal>
    </>
  );
}
