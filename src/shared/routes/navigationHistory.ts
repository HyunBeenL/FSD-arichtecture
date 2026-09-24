/* 이 모듈은 브라우저가 방금 떠나온 경로를 기억한다.
   '뒤로' 버튼이 브라우저 히스토리 대신 이 값을 쓴다 */

/* previousPath 는 지금 화면 바로 앞에 있던 경로를 보관한다 */
let previousPath: string | null = null;

/* currentPath 는 지금 화면의 경로를 보관한다 */
let currentPath: string | null = null;

/* getPreviousPath 는 화면이 '뒤로' 버튼의 목적지를 읽게 한다.
   앞 화면이 없으면 null 을 돌려준다 */
export function getPreviousPath(): string | null {
  return previousPath;
}

/* recordPath 는 NavigationTracker 가 경로를 옮길 때마다 부른다.
   같은 경로를 다시 받으면 앞 경로를 덮어쓰지 않는다 */
export function recordPath(pathname: string): void {
  if (currentPath === pathname) return;
  previousPath = currentPath;
  currentPath = pathname;
}
