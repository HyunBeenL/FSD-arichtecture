'use client';

/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 게시글 목록을 표로 그린다 */
import RouterLink from 'next/link';
import { Link, Table, type TableColumn } from '@/design-system';
import { formatDate } from '@/shared/lib';
import { PostStatusText, type Post } from '@/entities/post';

/* columns 는 표의 각 열이 무엇을 어떻게 그릴지 정한다 */
const columns: Array<TableColumn<Post>> = [
  {
    id: 'title',
    header: '제목',
    cell: (post) => (
      <Link asChild variant="subtle">
        <RouterLink href={`/board/${post.id}`}>{post.title}</RouterLink>
      </Link>
    ),
  },
  { id: 'author', header: '작성자', cell: (post) => post.author },
  { id: 'createdAt', header: '작성일', cell: (post) => formatDate(post.createdAt) },
  { id: 'status', header: '상태', cell: (post) => <PostStatusText post={post} /> },
];

/* PostTable 은 넘겨받은 게시글을 표로 그린다.
   페이지 이동과 검색은 이 표를 쓰는 화면이 맡는다 */
export function PostTable({ posts }: { posts: Post[] }) {
  return (
    <Table
      columns={columns}
      rows={posts}
      rowKey={(post) => post.id}
      emptyMessage="게시글이 없습니다."
    />
  );
}
