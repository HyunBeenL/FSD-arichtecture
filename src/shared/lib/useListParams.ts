'use client';

/* 이 모듈은 목록 화면의 페이지 · 정렬 · 필터 · 검색어를 URL 쿼리에 보관한다 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/* SortSpec 은 정렬 기준을 필드와 방향으로 나눠 담는다 */
export interface SortSpec {
  /* 목록을 정렬할 기준 필드의 이름 */
  field: string;
  /* 오름차순인지 내림차순인지 */
  direction: 'asc' | 'desc';
}

/* UseListParamsOptions 는 호출부가 useListParams 에 넘기는 설정이다 */
export interface UseListParamsOptions {
  /* URL 에 sort 가 없을 때 useListParams 가 쓸 정렬. 'field:direction' 형식이다 */
  defaultSort?: string;
  /* URL 에 pageSize 가 없을 때 useListParams 가 쓸 한 페이지 크기 */
  defaultPageSize?: number;
  /* useListParams 가 URL 에서 읽어 filters 에 담을 쿼리 키 목록 */
  filterKeys?: readonly string[];
  /* 사용자가 입력을 멈춘 뒤 useListParams 가 URL 을 고치기까지 기다리는 시간 */
  searchDebounceMs?: number;
  /* 검색어가 이 길이 이상일 때만 useListParams 가 URL 에 검색어를 넣는다 */
  searchMinLength?: number;
}

/* ListParams 는 useListParams 가 화면에 돌려주는 목록 상태와 조작 함수다 */
export interface ListParams {
  /* URL 이 가리키는 현재 페이지 번호 */
  page: number;
  /* URL 이 가리키는 한 페이지 크기 */
  pageSize: number;
  /* URL 이 가리키는 현재 정렬 */
  sort: SortSpec;
  /* URL 에서 읽은 필터 값들. filterKeys 에 적은 키만 담긴다 */
  filters: Record<string, string>;
  /* 목록 API 에 보낼 검색어. URL 에 반영된 값이다 */
  search: string;
  /* 검색 입력창에 그릴 값. 사용자가 방금 친 값이다 */
  searchInput: string;
  /* 사용자가 친 값이 아직 URL 에 반영되지 않았으면 true 다 */
  isSearchPending: boolean;

  /* 화면이 페이지를 옮길 때 부른다 */
  setPage(page: number): void;
  /* 화면이 필터 하나를 바꿀 때 부른다. useListParams 는 페이지를 1 로 되돌린다 */
  setFilter(key: string, value: string): void;
  /* 검색 입력창이 값이 바뀔 때마다 부른다 */
  setSearchInput(value: string): void;
  /* 화면이 정렬 머리글을 누를 때 부른다. 같은 필드를 다시 누르면 방향이 뒤집힌다 */
  toggleSort(field: string): void;

  /* 목록 API 에 그대로 넘길 쿼리 */
  query: ListQuery;
}

/* ListQuery 는 목록 API 에 그대로 넘기는 쿼리 파라미터다 */
export interface ListQuery {
  /* 받아올 페이지 번호 */
  page: number;
  /* 받아올 한 페이지 크기 */
  pageSize: number;
  /* 'field:direction' 형식으로 합친 정렬 */
  sort: string;
  /* 검색어. 비어 있으면 담지 않는다 */
  search?: string;
  /* filterKeys 로 받은 필터들이 키 이름 그대로 담긴다 */
  [key: string]: string | number | undefined;
}

/* useListParams 는 목록 화면의 페이지 · 정렬 · 필터 · 검색어를 URL 에서 읽고 URL 에 쓴다.
   목록 상태가 URL 에 있으므로 화면은 새로고침과 뒤로 가기에서 같은 목록을 그린다 */
export function useListParams({
  defaultSort = 'createdAt:desc',
  defaultPageSize = 10,
  filterKeys = [],
  searchDebounceMs = 300,
  searchMinLength = 2,
}: UseListParamsOptions = {}): ListParams {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = positiveInt(searchParams.get('page'), 1);
  const pageSize = positiveInt(searchParams.get('pageSize'), defaultPageSize);
  const sortRaw = searchParams.get('sort') ?? defaultSort;
  const search = searchParams.get('q') ?? '';

  /* 이 useMemo 는 URL 의 'field:direction' 문자열을 SortSpec 으로 나눈다 */
  const sort = useMemo<SortSpec>(() => {
    const [field = 'createdAt', direction] = sortRaw.split(':');
    return { field, direction: direction === 'asc' ? 'asc' : 'desc' };
  }, [sortRaw]);

  /* filterKeysId 는 filterKeys 배열을 문자열 하나로 만든다.
     호출부가 배열을 매번 새로 넘겨도 아래 useMemo 는 값이 같으면 다시 계산하지 않는다 */
  const filterKeysId = filterKeys.join(',');

  /* 이 useMemo 는 filterKeys 에 적은 키만 URL 에서 골라 담는다 */
  const filters = useMemo(() => {
    const result: Record<string, string> = {};
    for (const key of filterKeysId === '' ? [] : filterKeysId.split(',')) {
      const value = searchParams.get(key);
      if (value !== null && value !== '') result[key] = value;
    }
    return result;
  }, [searchParams, filterKeysId]);

  /* update 는 넘겨받은 쿼리 키만 고쳐 새 URL 로 이동한다.
     값이 비어 있는 키는 URL 에서 지운다 */
  const update = useCallback(
    (changes: Record<string, string | undefined>, historyMode: 'push' | 'replace') => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === undefined || value === '') next.delete(key);
        else next.set(key, value);
      }
      const query = next.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      if (historyMode === 'replace') router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  /* searchInput 은 사용자가 방금 친 값을 들고 있다. URL 의 검색어보다 앞선다 */
  const [searchInput, setSearchInputState] = useState(search);

  /* 이 블록은 뒤로 가기처럼 URL 의 검색어가 바깥에서 바뀌면 입력창 값도 따라 바꾼다 */
  const [lastSearch, setLastSearch] = useState(search);
  if (search !== lastSearch) {
    setLastSearch(search);
    setSearchInputState(search);
  }

  /* 이 useEffect 는 사용자가 입력을 멈추면 URL 의 q 를 고치고 페이지를 첫 장으로 되돌린다 */
  useEffect(() => {
    const nextTerm = searchInput.length >= searchMinLength ? searchInput : '';
    if (nextTerm === search) return;

    const timer = setTimeout(() => {
      update({ q: nextTerm || undefined, page: undefined }, 'replace');
    }, searchDebounceMs);
    return () => clearTimeout(timer);
  }, [searchInput, search, searchMinLength, searchDebounceMs, update]);

  return {
    page,
    pageSize,
    sort,
    filters,
    search,
    searchInput,
    isSearchPending: (searchInput.length >= searchMinLength ? searchInput : '') !== search,

    setPage: useCallback((next: number) => update({ page: String(next) }, 'push'), [update]),

    setFilter: useCallback(
      (key: string, value: string) =>
        update({ [key]: value || undefined, page: undefined }, 'push'),
      [update],
    ),

    setSearchInput: useCallback((value: string) => setSearchInputState(value), []),

    toggleSort: useCallback(
      (field: string) => {
        const direction = sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc';
        update({ sort: `${field}:${direction}`, page: undefined }, 'push');
      },
      [sort, update],
    ),

    query: {
      page,
      pageSize,
      sort: `${sort.field}:${sort.direction}`,
      ...(search ? { search } : {}),
      ...filters,
    },
  };
}

/* positiveInt 는 URL 쿼리 문자열을 양의 정수로 바꾼다.
   양의 정수가 아니면 fallback 을 돌려준다 */
function positiveInt(raw: string | null, fallback: number): number {
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
