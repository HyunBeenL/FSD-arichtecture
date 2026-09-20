# FSD 공용 아키텍처

프론트엔드 공용 아키텍처 뼈대. **Feature-Sliced Design + Next.js App Router** 로 계층과
의존 방향을 고정하고, 그 규칙을 문서가 아니라 **ESLint 가 `error` 로** 강제한다.

새 프로젝트를 이 저장소에서 시작하면 "이 코드를 어디에 둘 것인가" 에 매번 답을 다시 찾지 않아도 된다.

## 계층

```text
app        ← 위
views
widgets
features
entities
shared     ← 아래

design-system   계층 밖. 별도 패키지로 뗄 것을 전제한다
```

| 계층            | 책임                                                                      |
| --------------- | ------------------------------------------------------------------------- |
| `app`           | 전역 조립물 — Provider · 에러 경계 · 가드 · QueryClient · Route Handler 구현 |
| `views`         | 라우트 단위 화면                                                          |
| `widgets`       | 도메인 또는 화면 구조에 종속된 조립 단위                                  |
| `features`      | 행위 단위 — UI · 상태 변경 · 실패 처리를 함께 소유                        |
| `entities`      | 도메인 데이터와 읽기·쓰기 능력                                            |
| `shared`        | 도메인 비종속 공통 모듈                                                   |
| `design-system` | 앱 비종속 UI 컴포넌트와 디자인 토큰                                       |

**슬라이스는 도메인으로 나눈다.** 행동마다 만들지 않는다 (`board-delete` X, `board` O).
`app` 과 `shared` 에는 슬라이스를 두지 않고 세그먼트로 나눈다.

## 규칙

핵심은 두 줄이다.

- **모듈은 자기보다 아래 계층만 import 한다.**
- **같은 계층의 다른 슬라이스는 서로를 참조하지 않는다.**

두 슬라이스가 같은 것을 쓰면 그 계층에는 둘 수 없다. `shared` 로 내리거나 위 계층에서 조립한다.

### 기계가 잡는 것

| ID   | 규칙                                                                     | 검사               |
| ---- | ------------------------------------------------------------------------ | ------------------ |
| L-02 | 모듈은 자기보다 아래 계층만 import 한다                                  | eslint             |
| L-03 | 같은 계층의 다른 슬라이스를 참조하지 않는다                              | eslint             |
| L-08 | `design-system` 은 앱 코드를 import 하지 않는다                          | eslint + depcruise |
| L-09 | `design-system` 은 `next` · `axios` · `@tanstack/*` · `zustand` 를 모른다 | eslint + depcruise |
| A-02 | 밖에서는 슬라이스 배럴만 참조한다 (`@/entities/post` O, `.../api/…` X)   | eslint             |
| —    | 순환 의존이 없다                                                         | depcruise          |
| —    | 제품 코드가 devDependency 를 부르지 않는다                               | depcruise          |

`npm run check` 가 커밋 전에 전부 돌린다.

> 규칙은 켜는 것으로 끝나지 않는다. **일부러 위반을 만들어 잡히는지 확인한다.**
> 검증하지 않은 규칙은 조용히 죽어 있는다.

### 사람이 지키는 것

| ID   | 규칙                                                                   |
| ---- | ---------------------------------------------------------------------- |
| S-03 | 빈 세그먼트 폴더를 미리 만들지 않는다. 첫 식구가 들어올 때 만든다      |
| P-01 | 소비자를 전부 적고 **가장 아래 계층**을 찾는다. 그 계층이거나 그 아래  |
| P-05 | 두 번째 소비자가 **실제로 나타났을 때** 공통으로 뽑는다                |
| A-01 | 모든 슬라이스는 `index.ts` 를 갖는다                                   |
| A-04 | 서버 전용 표면은 `server.ts` 라는 두 번째 배럴로 연다                  |
| A-06 | `entities` 배럴에 HTTP 함수를 내보내지 않는다                          |
| L-10 | `design-system` 이 필요한 값은 prop 으로 받는다                        |

## 구조

```text
app/                 Next 라우팅 · 렌더 전략(SSR/CSR) · Route Handler
src/
├─ app/              Provider 조립 · 가드 · QueryClient
├─ views/            화면. 라우트 하나에 대응
├─ widgets/          여러 조각을 묶은 UI 블록
├─ features/         행위 하나를 UI 까지 감싼 것
├─ entities/         비즈니스 명사 + 그 명사의 능력
├─ shared/           도메인을 모르는 도구 (api · lib · ui · routes)
└─ design-system/    계층 밖
```

`app/` 이 둘인 것은 오타가 아니다. **루트 `app/` 은 Next 라우팅 폴더**이고,
**FSD 의 app 계층은 `src/app`** 이다. 루트 `app/**/page.tsx` 는 연결만 하고,
화면은 `views` 가 그린다.

## 기술 스택

React 19 · TypeScript · **Next.js 16 (App Router)** · TanStack Query · Zustand · axios ·
react-hook-form + zod · i18next · Radix UI · Tailwind CSS 4 + cva · Storybook

## 시작하기

```bash
npm install
npm run dev
```

## 스크립트

| 명령                  | 하는 일                                                     |
| --------------------- | ----------------------------------------------------------- |
| `npm run dev`         | 개발 서버                                                   |
| `npm run build`       | 프로덕션 빌드                                               |
| `npm run start`       | 프로덕션 빌드 실행                                          |
| `npm run typecheck`   | `tsc --noEmit`                                              |
| `npm run lint`        | ESLint — FSD 계층 규칙 포함                                 |
| `npm run lint:cycles` | dependency-cruiser — 순환 의존 · design-system 격리         |
| `npm run format`      | Prettier                                                    |
| `npm run check`       | typecheck + lint + lint:cycles + format:check               |
| `npm run storybook`   | Storybook                                                   |

## 새 도메인을 더할 때

아래에서 위로 간다. 필요 없는 계층은 건너뛴다.

1. `entities/{도메인}` — zod 스키마 · HTTP 함수 · 쿼리 키 팩토리 · mutation 훅
2. `features/{도메인}` — 행위 하나가 UI · 상태 변경 · 실패 처리를 함께 갖는 경우만
3. `widgets/{도메인}` — 여러 조각을 묶어야 하는 경우만
4. `views/{도메인}` — 화면
5. `app/**/page.tsx` — 라우트 연결

슬라이스마다 `index.ts` 를 만들고, **밖에서는 그 배럴만 본다.**
