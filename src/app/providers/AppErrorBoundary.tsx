'use client';

/* 이 모듈은 테마와 번역을 쓰는 에러 경계를 담는다 */
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorFallback } from '@/shared/ui';

/* AppErrorBoundaryProps 는 이 경계가 감쌀 트리와 되살리기 함수를 받는다 */
export interface AppErrorBoundaryProps {
  /* 이 경계가 감쌀 화면 */
  children: ReactNode;
  /* 다시 시도를 눌렀을 때 부를 함수. 넘기지 않으면 다시 시도 버튼을 그리지 않는다 */
  onReset?: () => void;
}

/* AppErrorBoundaryState 는 이 경계가 실패를 잡았는지 기억한다 */
interface AppErrorBoundaryState {
  hasError: boolean;
}

/* AppErrorFallback 은 번역한 문구로 폴백을 그린다.
   클래스 컴포넌트가 훅을 쓸 수 없어 함수 컴포넌트로 나눠 둔다 */
function AppErrorFallback({ onReset }: { onReset?: () => void }) {
  const { t } = useTranslation();

  return (
    <ErrorFallback title={t('errors:unknown')} retryLabel={t('action.retry')} onRetry={onReset} />
  );
}

/* AppErrorBoundary 는 하위 트리의 렌더 실패를 잡아 다시 시도할 수 있는 폴백을 그린다 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  /* React 는 하위 트리가 던지면 이 함수를 불러 폴백으로 바꾼다 */
  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  /* React 는 잡은 실패를 이 함수로 넘긴다. 이 경계는 콘솔에만 남긴다 */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[AppErrorBoundary]', error, errorInfo.componentStack);
  }

  /* handleReset 은 폴백을 걷고 하위 트리를 다시 그린다 */
  private handleReset = (): void => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    return <AppErrorFallback onReset={this.props.onReset ? this.handleReset : undefined} />;
  }
}
