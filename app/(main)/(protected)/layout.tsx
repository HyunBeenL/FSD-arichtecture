/* 이 파일은 (protected) 그룹의 화면을 로그인한 사용자에게만 보여 준다 */
import { RequireAuth } from '@/app';

/* ProtectedLayout 은 (protected) 아래 모든 화면을 RequireAuth 로 감싼다 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
