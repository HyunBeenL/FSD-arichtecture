/* 이 파일은 (main) 그룹의 화면에 헤더와 푸터가 있는 골격을 씌운다 */
import { AppLayout } from '@/widgets/layout';

/* MainLayout 은 (main) 아래 모든 화면을 AppLayout 으로 감싼다 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
