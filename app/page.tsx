/* 루트 라우트의 자리 표시자다.
   L-07 에 따라 page.tsx 는 연결만 한다 — 화면이 생기면 views 의 컴포넌트로 바꾼다 */

const LAYERS = [
  { name: 'app', role: '전역 조립물 — Provider · 에러 경계 · 가드 · QueryClient' },
  { name: 'views', role: '라우트 단위 화면' },
  { name: 'widgets', role: '도메인 또는 화면 구조에 종속된 조립 단위' },
  { name: 'features', role: '행위 단위 — UI · 상태 변경 · 실패 처리를 함께 소유' },
  { name: 'entities', role: '도메인 데이터와 읽기·쓰기 능력' },
  { name: 'shared', role: '도메인 비종속 공통 모듈' },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">FSD Architecture</h1>
      <p className="mt-2 text-sm text-gray-600">
        모듈은 자기보다 아래 계층만 import 한다. 같은 계층의 다른 슬라이스도 참조하지 않는다.
      </p>

      <ol className="mt-8 space-y-px">
        {LAYERS.map((layer) => (
          <li key={layer.name} className="flex gap-4 bg-gray-50 px-4 py-3 text-sm">
            <code className="w-20 shrink-0 font-semibold">{layer.name}</code>
            <span className="text-gray-600">{layer.role}</span>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-xs text-gray-500">
        design-system 은 계층 밖이다. 별도 패키지로 뗄 것을 전제한다.
      </p>
    </main>
  );
}
