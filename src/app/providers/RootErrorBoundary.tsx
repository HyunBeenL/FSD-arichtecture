'use client';

/* 이 모듈은 앱이 통째로 죽었을 때 쓰는 마지막 경계를 담는다.
   테마 · 번역 · 디자인 시스템이 모두 죽어도 그려지도록 인라인 스타일만 쓴다 */
import { Component, type CSSProperties, type ErrorInfo, type ReactNode } from 'react';

/* RootErrorBoundaryProps 는 이 경계가 감쌀 트리를 받는다 */
interface RootErrorBoundaryProps {
  children: ReactNode;
}

/* RootErrorBoundaryState 는 이 경계가 실패를 잡았는지 기억한다 */
interface RootErrorBoundaryState {
  hasError: boolean;
}

/* overlayStyle 은 폴백 화면을 창 가운데에 놓는다 */
const overlayStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  backgroundColor: '#ffffff',
  color: '#111827',
  fontFamily: "system-ui, -apple-system, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif",
};

/* cardStyle 은 안내 문구를 담는 상자의 모양이다 */
const cardStyle: CSSProperties = {
  maxWidth: '420px',
  width: '100%',
  textAlign: 'center',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '32px 24px',
};

/* titleStyle 은 안내 제목의 모양이다 */
const titleStyle: CSSProperties = {
  margin: '0 0 12px',
  fontSize: '18px',
  fontWeight: 600,
  lineHeight: 1.4,
};

/* descriptionStyle 은 안내 설명의 모양이다 */
const descriptionStyle: CSSProperties = {
  margin: '0 0 24px',
  fontSize: '14px',
  lineHeight: 1.6,
  color: '#4b5563',
};

/* buttonStyle 은 새로고침 버튼의 모양이다 */
const buttonStyle: CSSProperties = {
  appearance: 'none',
  border: '1px solid transparent',
  borderRadius: '6px',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 500,
  fontFamily: 'inherit',
  padding: '10px 20px',
  cursor: 'pointer',
};

/* RootErrorBoundary 는 하위 트리의 렌더 실패를 잡아 새로고침 안내를 그린다.
   AppProviders 가 가장 바깥에 둔다 */
export class RootErrorBoundary extends Component<RootErrorBoundaryProps, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = { hasError: false };

  /* React 는 하위 트리가 던지면 이 함수를 불러 폴백으로 바꾼다 */
  static getDerivedStateFromError(): RootErrorBoundaryState {
    return { hasError: true };
  }

  /* React 는 잡은 실패를 이 함수로 넘긴다. 이 경계는 콘솔에만 남긴다 */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[RootErrorBoundary]', error, errorInfo.componentStack);
  }

  /* handleReload 는 페이지를 통째로 다시 불러 앱을 처음부터 세운다 */
  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div style={overlayStyle} role="alert">
        <div style={cardStyle}>
          <h1 style={titleStyle}>화면을 불러오지 못했습니다</h1>
          <p style={descriptionStyle}>
            일시적인 문제일 수 있습니다.
            <br />
            새로고침해도 같은 화면이 나오면 담당자에게 알려 주세요.
          </p>
          <button type="button" style={buttonStyle} onClick={this.handleReload}>
            새로고침
          </button>
        </div>
      </div>
    );
  }
}
