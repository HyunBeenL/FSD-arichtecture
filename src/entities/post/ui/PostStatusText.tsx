/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 게시글의 상태를 사용자에게 보일 문구로 그린다 */
import { Text } from '@/design-system';
import type { Post } from '../model/types';

/* LABEL 은 게시글 상태마다 화면에 보일 문구를 짝지어 담는다 */
const LABEL: Record<Post['status'], string> = {
  draft: '임시 저장',
  published: '발행됨',
};

/* PostStatusText 는 게시글의 상태 문구를 그린다.
   발행된 글은 진한 색, 임시 저장 글은 흐린 색으로 구분한다 */
export function PostStatusText({ post }: { post: Post }) {
  return (
    <Text size="caption" color={post.status === 'published' ? 'textPrimary' : 'textSecondary'}>
      {LABEL[post.status]}
    </Text>
  );
}
