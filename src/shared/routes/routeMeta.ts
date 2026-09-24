'use client';

/* 이 모듈은 경로마다 정해 둔 제목 · 이동 경로 · 레이아웃 설정을 화면에 준다 */
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

/* RouteMeta 는 한 경로에 딸린 화면 설정이다 */
export interface RouteMeta {
  /* 레이아웃이 문서 제목 자리에 쓸 문자열 */
  title?: string;
  /* 레이아웃이 상단에 그릴 이동 경로. 위 단계부터 순서대로 담는다 */
  breadcrumb?: string[];
  /* 이 값이 true 면 레이아웃은 푸터를 그리지 않는다 */
  hideFooter?: boolean;
}

/* ROUTE_META 는 경로 패턴과 그 경로의 RouteMeta 를 짝지어 담는다.
   useRouteMeta 는 위에서부터 훑어 처음 맞는 것을 쓴다 */
const ROUTE_META: ReadonlyArray<readonly [RegExp, RouteMeta]> = [
  [/^\/login$/, { hideFooter: true }],
  [/^\/$/, { title: 'FSD Architecture' }],
];

/* useRouteMeta 는 지금 경로에 맞는 RouteMeta 를 돌려준다.
   맞는 패턴이 없으면 빈 객체를 돌려준다 */
export function useRouteMeta(): RouteMeta {
  const pathname = usePathname();

  return useMemo(() => {
    for (const [pattern, meta] of ROUTE_META) {
      if (pattern.test(pathname)) return meta;
    }
    return {};
  }, [pathname]);
}
