/* 이 모듈은 에러 경계가 화면 대신 그리는 폴백을 준다 */
import { Alert, Button, Stack } from '@/design-system';

/* ErrorFallbackProps 는 에러 경계가 ErrorFallback 에 넘기는 props 다 */
export interface ErrorFallbackProps {
  /* 경고 상자에 그릴 제목. 호출부가 번역해 넘긴다 */
  title: string;
  /* 제목 아래에 그릴 설명 */
  description?: React.ReactNode;
  /* 다시 시도 버튼에 그릴 문구 */
  retryLabel?: string;
  /* 다시 시도 버튼을 눌렀을 때 부를 함수. 호출부가 넘기지 않으면 버튼을 그리지 않는다 */
  onRetry?: () => void;
  /* 폴백의 크기. 라우트 전체를 덮으면 'md', 화면 일부를 덮으면 'sm' 을 넘긴다 */
  size?: 'sm' | 'md';
}

/* ErrorFallback 은 실패한 자리에 경고 상자와 다시 시도 버튼을 그린다.
   어떤 문구를 띄울지는 호출부가 정해 넘긴다 */
export function ErrorFallback({
  title,
  description,
  retryLabel,
  onRetry,
  size = 'md',
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8 *:w-full *:max-w-120">
      <Stack gap={size === 'sm' ? 2 : 4}>
        <Alert tone="critical" title={title}>
          {description}
        </Alert>
        {onRetry && (
          <Button variant="outline" tone="default" size={size} onClick={onRetry}>
            {retryLabel}
          </Button>
        )}
      </Stack>
    </div>
  );
}
