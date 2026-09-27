/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 게시글의 모양을 정하고, 응답이 그 모양인지 검사할 수단을 준다 */
import { z } from 'zod';

/* postSchema 는 게시글 하나가 갖춰야 할 모양이다.
   post.api 는 이 스키마로 백엔드 응답을 검사한다 */
export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  createdAt: z.string(),
  status: z.enum(['draft', 'published']),
});

/* Post 는 화면과 API 가 주고받는 게시글 하나다 */
export type Post = z.infer<typeof postSchema>;

/* postListSchema 는 게시글 목록 응답이 갖춰야 할 모양이다 */
export const postListSchema = z.object({
  items: z.array(postSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

/* PostList 는 한 페이지의 게시글과 전체 개수를 함께 담는다 */
export type PostList = z.infer<typeof postListSchema>;
