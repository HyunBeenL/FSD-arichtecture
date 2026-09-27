/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 게시글 API 를 부르고, 받은 응답이 Post 모양인지 검사한다 */
import { apiClient, type RequestOptions } from '@/shared/api';
import { postListSchema, postSchema, type Post, type PostList } from '../model/types';

/* PostListQuery 는 목록 API 에 넘기는 쿼리 파라미터다.
   useListParams 가 돌려준 query 를 그대로 받는다 */
export interface PostListQuery {
  /* 받아올 페이지 번호 */
  page: number;
  /* 받아올 한 페이지 크기 */
  pageSize: number;
  /* 'field:direction' 형식으로 합친 정렬 */
  sort?: string;
  /* 제목과 내용에서 찾을 검색어 */
  search?: string;
  /* 걸러 낼 게시글 상태 */
  status?: string;
  /* 화면이 덧붙이는 필터가 키 이름 그대로 담긴다 */
  [key: string]: string | number | undefined;
}

/* CreatePostInput 은 게시글을 새로 만들 때 백엔드에 보내는 값이다 */
export interface CreatePostInput {
  /* 새 게시글의 제목 */
  title: string;
  /* 새 게시글의 내용 */
  content: string;
}

/* UpdatePostInput 은 게시글을 고칠 때 백엔드에 보내는 값이다 */
export interface UpdatePostInput {
  /* 고칠 게시글의 id. 경로에 넣고 본문에서는 뺀다 */
  id: string;
  /* 바꿀 제목 */
  title: string;
  /* 바꿀 내용 */
  content: string;
}

/* getPostList 는 한 페이지의 게시글을 받아 온다 */
export async function getPostList(
  query: PostListQuery,
  options?: RequestOptions,
): Promise<PostList> {
  return postListSchema.parse(
    await apiClient.get<unknown>('/posts', { ...options, query: { ...query } }),
  );
}

/* getPost 는 게시글 하나를 받아 온다 */
export async function getPost(id: string, options?: RequestOptions): Promise<Post> {
  return postSchema.parse(await apiClient.get<unknown>(`/posts/${id}`, options));
}

/* createPost 는 게시글을 새로 만들고, 만들어진 게시글을 돌려받는다 */
export async function createPost(input: CreatePostInput, options?: RequestOptions): Promise<Post> {
  return postSchema.parse(await apiClient.post<unknown>('/posts', input, options));
}

/* updatePost 는 게시글을 고치고, 고쳐진 게시글을 돌려받는다.
   id 는 경로에 넣고 나머지만 본문으로 보낸다 */
export async function updatePost(input: UpdatePostInput, options?: RequestOptions): Promise<Post> {
  const { id, ...body } = input;
  return postSchema.parse(await apiClient.put<unknown>(`/posts/${id}`, body, options));
}

/* deletePost 는 게시글을 지운다 */
export async function deletePost(id: string, options?: RequestOptions): Promise<void> {
  await apiClient.delete(`/posts/${id}`, options);
}
