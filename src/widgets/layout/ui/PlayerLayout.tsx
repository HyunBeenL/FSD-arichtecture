'use client';

/* 이 모듈은 화면을 가득 채우고 나가기 버튼만 두는 몰입형 골격을 그린다 */
import { useEffect, useRef, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { IconButton } from '@/design-system';
import { usePageMetaValue } from '@/shared/lib';
import { getPreviousPath, useRouteMeta } from '@/shared/routes';

/* PlayerLayoutProps 는 app 계층이 PlayerLayout 에 넘기는 props 다 */
export interface PlayerLayoutProps {
  /* 본문에 그릴 화면 */
  children?: ReactNode;
  /* 나가기 버튼을 눌렀을 때 부를 함수. 넘기면 PlayerLayout 은 직접 이동하지 않는다 */
  onExit?: () => void;
  /* 들어오기 전 경로를 모를 때 나가기 버튼이 옮겨 갈 경로 */
  exitFallback?: string;
}

/* PlayerLayout 은 얇은 상단 막대와 본문만 그려 화면 전체를 본문에 내준다.
   나가기 버튼은 사용자가 들어오기 전에 있던 경로로 돌려보낸다 */
export function PlayerLayout({ children, onExit, exitFallback = '/' }: PlayerLayoutProps) {
  const router = useRouter();
  const routeMeta = useRouteMeta();
  const pageMeta = usePageMetaValue();

  /* entryFromRef 는 이 화면에 들어오기 직전의 경로를 보관한다 */
  const entryFromRef = useRef<string | null>(null);
  /* 이 useEffect 는 들어온 직후 한 번만 읽는다. 뒤에 경로가 더 쌓여도 목적지는 그대로다 */
  useEffect(() => {
    entryFromRef.current = getPreviousPath();
  }, []);

  /* handleExit 는 들어오기 전 경로로 되돌아간다.
     되돌아간 자리에서 다시 뒤로 갈 때 이 화면으로 오지 않도록 히스토리를 바꿔 치운다 */
  const handleExit = () => {
    if (onExit) {
      onExit();
      return;
    }
    router.replace(entryFromRef.current ?? exitFallback);
  };

  const title = pageMeta.title ?? routeMeta.title;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-surface-sunken">
      <div className="flex shrink-0 items-center gap-2 border-b border-border bg-surface-raised px-4 py-2">
        <IconButton
          label="학습창 나가기"
          icon={<X className="size-4" aria-hidden />}
          variant="ghost"
          size="sm"
          onClick={handleExit}
        />

        {title && <span className="truncate text-body-sm font-medium text-fg">{title}</span>}

        <div className="flex min-w-0 flex-1 items-center justify-end">{pageMeta.actions}</div>
      </div>

      <main className="flex-1 overflow-auto p-4">{children}</main>
    </div>
  );
}
