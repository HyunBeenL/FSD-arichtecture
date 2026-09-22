'use client';

/* ⚠️ 샘플 — 이 화면은 스켈레톤이 무엇을 갖췄는지 보여 준다.
   복사해 쓰는 쪽은 이 화면을 자기 첫 화면으로 바꾼다 */
import { useState } from 'react';
import { Heading, Stack, Text } from '@/design-system';
import { Pagination, SubmitButton } from '@/shared/ui';

/* LAYERS 는 이 스켈레톤이 고정한 계층과 각 계층의 책임이다 */
const LAYERS = [
  { name: 'app', role: '전역 조립물 — Provider · 에러 경계 · 가드 · QueryClient' },
  { name: 'views', role: '라우트 단위 화면' },
  { name: 'widgets', role: '도메인 또는 화면 구조에 종속된 조립 단위' },
  { name: 'features', role: '행위 단위 — UI · 상태 변경 · 실패 처리를 함께 소유' },
  { name: 'entities', role: '도메인 데이터와 읽기·쓰기 능력' },
  { name: 'shared', role: '도메인 비종속 공통 모듈' },
];

/* DEMO_TOTAL_PAGES 는 Pagination 예시가 그릴 전체 페이지 수다 */
const DEMO_TOTAL_PAGES = 12;

/* SUBMIT_DEMO_DURATION 은 SubmitButton 예시가 로딩 모양을 유지하는 시간이다. 단위는 ms 다 */
const SUBMIT_DEMO_DURATION = 1200;

/* HomePage 는 계층 목록과 shared/ui 의 버튼들을 한 화면에 그린다 */
export function HomePage() {
  /* page 는 Pagination 예시가 지금 가리키는 페이지 번호를 보관한다 */
  const [page, setPage] = useState(1);
  /* submitting 은 SubmitButton 예시가 로딩 모양을 그릴지를 보관한다 */
  const [submitting, setSubmitting] = useState(false);

  /* handleSubmit 은 폼 제출을 가로채고 SubmitButton 을 잠깐 로딩 모양으로 바꾼다 */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), SUBMIT_DEMO_DURATION);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Stack gap={10}>
        <Stack gap={2}>
          <Heading level={1} size="lg">
            FSD Architecture
          </Heading>
          <Text size="body-sm" tone="muted">
            모듈은 자기보다 아래 계층만 import 한다. 같은 계층의 다른 슬라이스도 참조하지 않는다.
          </Text>
        </Stack>

        <Stack gap={2}>
          <Text size="caption" tone="muted">
            계층
          </Text>
          <ol className="space-y-px">
            {LAYERS.map((layer) => (
              <li key={layer.name} className="bg-surface-sunken flex gap-4 px-4 py-3">
                <code className="text-body-sm w-20 shrink-0 font-semibold">{layer.name}</code>
                <Text size="body-sm" tone="muted">
                  {layer.role}
                </Text>
              </li>
            ))}
          </ol>
          <Text size="caption" tone="muted">
            design-system 은 계층 밖이다. 별도 패키지로 뗄 것을 전제한다.
          </Text>
        </Stack>

        <Stack gap={5}>
          <Stack gap={1}>
            <Heading level={2} size="sm">
              shared/ui
            </Heading>
            <Text size="caption" tone="muted">
              design-system 위에 얹은 도메인 비종속 조합. 밖에서는 이 배럴만 본다
            </Text>
          </Stack>

          <Stack gap={2}>
            <Text size="caption" tone="muted">
              SubmitButton — 폼의 주 액션. type · variant · tone 을 고정한 Button 이다
            </Text>
            <form onSubmit={handleSubmit}>
              <Stack direction="row" gap={2} align="center" wrap>
                <SubmitButton loading={submitting}>저장</SubmitButton>
                <SubmitButton size="sm">작게</SubmitButton>
                <SubmitButton size="lg">크게</SubmitButton>
                <SubmitButton disabled>비활성</SubmitButton>
              </Stack>
            </form>
          </Stack>

          <Stack gap={2}>
            <Text size="caption" tone="muted">
              Pagination — 이전 · 번호 · 다음. 한 장뿐이면 아무것도 그리지 않는다
            </Text>
            <Pagination page={page} totalPages={DEMO_TOTAL_PAGES} onChange={setPage} />
            <Text size="caption" tone="muted">
              지금 {page} / {DEMO_TOTAL_PAGES} 쪽
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </main>
  );
}
