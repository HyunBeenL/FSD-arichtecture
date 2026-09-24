'use client';

/* 이 모듈은 경로가 바뀔 때마다 navigationHistory 에 그 경로를 적는다 */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordPath } from './navigationHistory';

/* NavigationTracker 는 app 계층이 레이아웃에 두는 컴포넌트다.
   화면에 아무것도 그리지 않고 경로만 기록한다 */
export function NavigationTracker() {
  const pathname = usePathname();

  useEffect(() => {
    recordPath(pathname);
  }, [pathname]);

  return null;
}
