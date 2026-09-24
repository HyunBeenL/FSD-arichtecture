'use client';

/* 이 모듈은 화면이 정한 제목과 액션 버튼을 레이아웃 헤더에 전달한다 */
import { useEffect, useId, useMemo } from 'react';
import type { ReactNode } from 'react';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

/* PageMeta 는 화면이 레이아웃 헤더에 올리는 제목과 액션이다 */
export interface PageMeta {
  /* 헤더가 제목 자리에 그릴 문자열 */
  title?: string;
  /* 헤더가 제목 오른쪽에 그릴 버튼이나 링크 */
  actions?: ReactNode;
}

/* PageMetaState 는 zustand 스토어가 들고 있는 PageMeta 와 그 조작 함수다 */
interface PageMetaState extends PageMeta {
  /* 지금 헤더를 차지한 화면을 가리키는 표식 */
  owner: symbol | null;
  /* 화면이 자기 제목과 액션을 헤더에 올릴 때 부른다 */
  publish(owner: symbol, meta: PageMeta): void;
  /* 화면이 사라질 때 부른다. 그 사이 다른 화면이 헤더를 차지했으면 지우지 않는다 */
  clear(owner: symbol): void;
}

/* usePageMetaStore 는 헤더에 올라가 있는 PageMeta 를 보관하는 zustand 스토어다 */
const usePageMetaStore = create<PageMetaState>((set, get) => ({
  owner: null,
  title: undefined,
  actions: undefined,

  publish(owner, meta) {
    set({ owner, title: meta.title, actions: meta.actions });
  },

  clear(owner) {
    if (get().owner !== owner) return;
    set({ owner: null, title: undefined, actions: undefined });
  },
}));

/* usePageMeta 는 화면이 자기 제목과 액션을 헤더에 올리게 한다.
   화면이 사라지면 usePageMeta 가 올린 것을 지운다 */
export function usePageMeta(factory: () => PageMeta, deps: React.DependencyList): void {
  const idSeed = useId();
  /* owner 는 이 화면이 올린 PageMeta 를 다른 화면 것과 구분하는 표식이다 */
  const owner = useMemo(() => Symbol(idSeed), [idSeed]);

  useEffect(() => {
    const { publish, clear } = usePageMetaStore.getState();
    publish(owner, factory());
    return () => clear(owner);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps 를 호출부가 넘기므로 배열 길이가 고정되지 않는다
  }, [owner, ...deps]);
}

/* usePageMetaValue 는 헤더가 지금 올라와 있는 제목과 액션을 읽게 한다 */
export function usePageMetaValue(): PageMeta {
  return usePageMetaStore(useShallow((state) => ({ title: state.title, actions: state.actions })));
}
