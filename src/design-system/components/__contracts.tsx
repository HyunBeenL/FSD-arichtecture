/**
 * 타입 계약.
 *
 * 이 파일은 아무 데서도 import 되지 않습니다. **타입 검사만이 목적**입니다 —
 * 주입 패턴이 타입 수준에서 성립하는지 여기서 깨집니다. 소비자가 없으면
 * 인터페이스가 틀렸다는 것을 알 방법이 없습니다.
 *
 * ⚠️ 타입만 봅니다. 런타임 동작(Slot 이 실제로 props 를 병합하는지, 포커스가
 * 옮겨 가는지)은 여기서 확인되지 않습니다 — 그건 스토리와 테스트의 몫입니다.
 */
import { AsyncState } from './AsyncState';
import { Button } from './Button';
import { Field } from './Field';
import { fieldIds } from './Field/fieldIds';
import { Link } from './Link';

function FakeRouterLink(props: { href: string; replace?: boolean; children?: React.ReactNode }) {
  return <a href={props.href}>{props.children}</a>;
}

function FakeControlledInput(props: {
  value: string;
  onChange: (next: string) => void;
  onBlur?: () => void;
  id?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}) {
  return <input value={props.value} onChange={(e) => props.onChange(e.target.value)} />;
}

/* ── 계약 1. asChild 로 라우터 링크를 주입한다 ──────────────────
   깨지면 라우터가 달린 링크·버튼을 만들 수 없다. design-system 이
   라우팅 라이브러리를 모른다는 불변식이 이 주입에 걸려 있다. */

export function LinkAsChildContract() {
  return (
    <Link asChild variant="subtle">
      <FakeRouterLink href="/" replace>
        홈으로
      </FakeRouterLink>
    </Link>
  );
}

export function ButtonAsChildContract() {
  return (
    <Button asChild variant="outline" tone="default" size="sm">
      <FakeRouterLink href="/board">목록으로</FakeRouterLink>
    </Button>
  );
}

/* ── 계약 2. 주입 없이 쓰는 기본형 ────────────────────────────── */

export function AnchorDefaultContract() {
  return (
    <Link href="https://example.com" target="_blank" rel="noreferrer" variant="standalone">
      외부 링크
    </Link>
  );
}

export function ButtonDefaultContract() {
  return (
    <Button type="submit" disabled tone="critical" loading>
      삭제
    </Button>
  );
}

/* ── 계약 3. Field 는 children 에 props 를 주입하지 않는다 ───────
   id 연결은 호출부가 `fieldIds()` 로 받아 직접 붙인다. 이 형태가
   성립해야 react-hook-form 의 Controller 를 끼울 수 있다. */

export function FieldWiringContract() {
  const id = 'contract-field';
  const { describedBy } = fieldIds(id, { description: true, error: true });

  return (
    <Field label="라벨" htmlFor={id} description="설명" error="에러 메시지" required>
      <FakeControlledInput
        value=""
        onChange={() => {}}
        onBlur={() => {}}
        id={id}
        aria-invalid
        aria-describedby={describedBy}
      />
    </Field>
  );
}

/* ── 계약 4. 상태 값 주입 ──────────────────────────────────────
   design-system 은 데이터 라이브러리를 모른다. 호출부가 번역해서 넘긴다. */

export function StatusInjectionContract() {
  return (
    <AsyncState
      status="loading"
      loading={<span>로딩</span>}
      error={<span>에러</span>}
      empty={<span>없음</span>}
    >
      <span>내용</span>
    </AsyncState>
  );
}
