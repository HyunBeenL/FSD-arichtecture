/* ⚠️ 샘플 — 게시판 도메인. 복사해 쓰는 쪽은 자기 도메인으로 바꾼다.
   이 모듈은 게시판 화면들이 상위로 돌아갈 때 쓰는 링크를 그린다 */
import RouterLink from 'next/link';
import { Link } from '@/design-system';

/* BackLinkProps 는 게시판 화면이 BackLink 에 넘기는 props 다 */
export interface BackLinkProps {
  /* 돌아갈 경로 */
  href: string;
  /* 화살표 뒤에 그릴 문구 */
  children: React.ReactNode;
}

/* BackLink 는 화살표와 문구로 된 되돌아가기 링크를 그린다.
   views/board 안에서만 쓰므로 배럴로 내보내지 않는다 */
export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link asChild variant="subtle">
      <RouterLink href={href}>← {children}</RouterLink>
    </Link>
  );
}
