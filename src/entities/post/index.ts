/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 파일은 post 슬라이스가 바깥에 여는 공개 표면이다 */
export { POST_QUERIES } from './api/post.query';
export { POST_MUTATIONS, useCreatePost, useUpdatePost, useDeletePost } from './api/post.mutation';

export type { PostListQuery, CreatePostInput, UpdatePostInput } from './api/post.api';

export { postSchema, postListSchema } from './model/types';
export type { Post, PostList } from './model/types';

export { PostStatusText } from './ui/PostStatusText';
