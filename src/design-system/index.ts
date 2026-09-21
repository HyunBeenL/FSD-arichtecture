/**
 * 퍼블릭 배럴.
 *
 * **이 파일이 유일한 공개면입니다.** 컴포넌트별 서브패스는 열지 않습니다.
 * `components/` 의 물리 구조가 소비자 계약이 되면 내부 정리가 breaking
 * change 가 되기 때문입니다.
 *
 * 토큰은 CSS 로만 나갑니다 — `tokens/theme.css` 를 앱의 CSS 진입점에서
 * import 합니다. 토큰 이름을 TS 로 내보내지 않는 이유는, 내보내는 순간
 * 컴포넌트가 `color="brandSubtle"` 같은 prop 을 받게 되고 그러면 Tailwind
 * 유틸리티와 두 벌이 되기 때문입니다.
 */
export * from './theme';
export * from './components';
export { cn } from './utils/cn';
